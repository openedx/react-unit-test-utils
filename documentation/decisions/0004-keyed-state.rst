Keyed useState
==============

Context
=======

React's `useState` hook does not track/care what value it is associated with in a given hook.  It only registers the *order* in which it was called.  This means that when mocking out `useState` calls, you must test the *order* of the calls in order to validate their initialization. 

Decision
========

It is the opinion of the author of this repo that testing the order of state value initialization is an anti-pattern, as it involves testing an implementation detail.  We will provide a simple wrapper (`useKeyedState`) around `useState` that takes a key purely for the purpose of making each `useState` call uniquely identifiable by something other than the order it was called in, within tests.

Consequences
============

React `useState` calls can be easily simulated and tested using provided utilities, but users will need to define a keyStore of state keys when defining state values for a hook module.

Status
======
Proposed
