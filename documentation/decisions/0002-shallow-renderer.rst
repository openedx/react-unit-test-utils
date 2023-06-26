Shallow renderer
================

Context
=======

React components can be tested in a variety of ways, that tend to correspond with the "depth" of simulation/render of the component.  In the phiolosphy of Unit-level testing, this repo provides a "shallow" react renderer, which allows for mocking of child components to provide a test ONLY of the component in question.

The renderer we use is built from `react-test-renderer`, and uses some logic from the now-deprecated `enzyme` library to ensure clean/small snapshots can be generated from a renderered component.

Decision
========

We will provide a `shallow` utility for rendering components, as well as a pattern and utility to mock child components for more isolated testing.

Consequences
============

The tools in this repo will not be optimized for running and then manipulating a component, or triggering its behaviors or that of its children.

Status
======

Proposed
