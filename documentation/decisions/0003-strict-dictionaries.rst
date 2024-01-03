Strict Dictionaries
===================

Context
=======

Vanilla javascript objects to not care/complain when called with "invalid" (missing) keys.  This can produce unfortunate side-effects when using an object as a key-store, as an `undefined` value can make it through initial consumption to sometimes cause failures further down the line in less trace-able ways.

Tangentially, there is a strong tendency in testing to use "magic strings" in tests.  These are strings typed directly into a test, rather than referenced from a variable.  The standard solution for this in other languages is generally to put those values into a keyStore, but when doing so in JS, the object will allow access to un-initialized keys.

Decision
========

We will provide a StrictDict utility method to explicitly wrap key-store objects that should fail/complain when called with invalid keys.

Consequences
============
Code and tests written using this library should be able to completely avaoid the need to reference "magic strings" in their tests.

Status
======
Proposed
