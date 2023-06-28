/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  isFragment,
  isLazy,
  isPortal,
  isMemo,
  isSuspense,
  isForwardRef,
} from 'react-is';
import ElementExplorer from './ElementExplorer';

const getNodeName = node => node.displayName || node.name || '';

class ReactShallowRenderer {
  shallowRenderer = null;

  constructor(children, { Wrapper = null } = {}) {
    this.shallowRenderer = new ShallowRenderer();
    this.shallowWrapper = Wrapper
      ? this.shallowRenderer.render(<Wrapper>{children}</Wrapper>)
      : this.shallowRenderer.render(children);
  }

  static shallow(Component) {
    let out;
    try {
      out = new ReactShallowRenderer(Component);
    } catch (error) {
      out = ReactShallowRenderer.flatRender(Component);
      console.log({ out });
    }
    return out;
  }

  static flatRender(child) {
    const loadEl = (toLoad) => {
      if (typeof toLoad === 'object') {
        const { children, ...props } = toLoad.props;
        const el = { type: toLoad.type, props };
        if (Array.isArray(children)) {
          el.children = children.map(loadEl);
        } else if (children !== undefined) {
          el.children = [loadEl(children)];
        } else {
          el.children = [];
        }
        return el;
      }
      // custom return for basic jsx components (mostly for shallow comparison)
      return {
        el: toLoad,
        type: null,
        props: {},
        children: [],
      };
    };
    return loadEl(child);
  }

  isEmptyRender() {
    const data = this.getRenderOutput();
    return data === null;
  }

  get snapshot() {
    return this.getRenderOutput(true);
  }

  get instance() {
    return new ElementExplorer(this.getRenderOutput(), ReactShallowRenderer.toSnapshot);
  }

  extractType(node) {
    if (typeof node === 'string') { return node; }

    const name = getNodeName(node.type) || node.type || 'Component';

    if (isLazy(node)) { return 'Lazy'; }

    if (isMemo(node)) { return `Memo(${name || this.extractType(node.type)})`; }

    if (isSuspense(node)) { return 'Suspense'; }

    if (isPortal(node)) { return 'Portal'; }

    if (isFragment(node)) { return 'Fragment'; }

    if (isForwardRef(node)) { return this.getWrappedName(node, node.type.render, 'ForwardRef'); }

    return name;
  }

  getWrappedName(outerNode, innerNode, wrapperName) {
    const functionName = getNodeName(innerNode);
    return outerNode.type.displayName || (functionName !== '' ? `${wrapperName}(${functionName})` : wrapperName);
  }

  getRenderOutput(render = false) {
    if (!this.shallowWrapper) {
      return this.shallowWrapper;
    }
    return this.transformNode(this.shallowWrapper, render);
  }

  // eslint-disable-next-line
  extractProps({ children, ...props } = {}, key, render) {
    const childrenArray = Array.isArray(children) ? children : [children];
    return {
      children: childrenArray.filter(Boolean).flatMap(
        (node) => this.transformNode(node, render),
      ),
      props: {
        ...props,
        ...(key ? { key } : {}),
      },
    };
  }

  transformNode(node, render) {
    if (Array.isArray(node)) {
      return node.map((n) => this.transformNode(n, render));
    }
    if (typeof node !== 'object') {
      return node;
    }
    const out = {
      type: this.extractType(node),
      ...this.extractProps(node.props, node.key, render),
    };
    if (render) {
      // this symbol is used by Jest to prettify serialized React test objects:
      // https://github.com/facebook/jest/blob/e0b33b74b5afd738edc183858b5c34053cfc26dd/packages/pretty-format/src/plugins/ReactTestComponent.ts
      out.$$typeof = Symbol.for('react.test.json');
    }
    return out;
  }

  static toSnapshot(data) {
    return {
      ...data,
      $$typeof: Symbol.for('react.test.json'),
      children: data.children.map(ReactShallowRenderer.toSnapshot),
    };
  }
}

export default ReactShallowRenderer.shallow;
