import { isEqual } from 'lodash';

class ElementExplorer {
  constructor(element, toSnapshot) {
    this.el = element;
    this.toSnapshot = toSnapshot;
    this.props = {};
    this.type = null;
    this.children = [];
    if (element.type) {
      this.props = element.props;
      this.type = element.type;
    }
    if (element.children) {
      this.children = element.children.map(child => new ElementExplorer(child, toSnapshot));
    }
  }

  findByTestId(testId) {
    const elements = [];
    const findChildrenByTestId = (el) => {
      if (el.props['data-testid'] === testId) {
        elements.push(el);
      }
      el.children.forEach(child => {
        findChildrenByTestId(child);
      });
    };
    findChildrenByTestId(this);
    return elements;
  }

  findByType(type) {
    const typeString = typeof type === 'string' ? type : type.name;
    const elements = [];
    const findChildrenByType = (el) => {
      if (el.type === typeString) {
        elements.push(el);
      }
      el.children.forEach(child => {
        findChildrenByType(child);
      });
    };
    findChildrenByType(this);
    return elements;
  }

  get data() {
    const out = {
      props: this.props,
      type: this.type,
      children: this.children.map(child => child.data),
    };
    if (this.type === null) {
      out.el = this.el;
    }
    return out;
  }

  matches(el) {
    return isEqual(el.data, this.data);
  }

  get snapshot() {
    return this.toSnapshot(this.el);
  }
}

export default ElementExplorer;
