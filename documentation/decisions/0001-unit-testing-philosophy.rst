Unit Testing Philosophy
=======================

Context
=======

This repo aims to focus on support for a specific classification and type of test.  The that end, it can be fairly opinionated in places in service of providing support for the full ecosystem of react component and hook unit testing.

Decision
========
This repo defines a unit test as a test that mocks as much as possible from the tested unit, to test it in complete isolation.  Each unit to be tested (be it a component or a method), should be tested in terms of its output and behavior, given its inputs.
This means that component behavior (hooks) should generally be pulled out into separate methods/files for test, and that child components should be mocked when rendering a component to allow it to be tested in isolation.

Status
======
Proposed

Consequences
============

The tools and examples in this repo will be build with the intention of supporting:

* Component testing without importing/loading/testing child components
* Hook/behavior testing without testing react component integration.
