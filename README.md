# reconstruct-o-matic

A machine vision multi-view scene reconstruction system that aggregates OpenNI data from multiple motion capture sensors to create one coherent reconstruction of the object(s) of interest.

For now, the system only runs in a Node.js server environment, but most of the library code is independent of the Node environment and could be used in other places, including your own applications.

## Principal components
- `math/`: a body of math-heavy 'library' code written in a mostly functional style to eliminate as much error-prone mutable state as possible while increasing its flexibility.
- Calibrators: a series of modules which calibrate a secondary sensor so that its subsequent data input can be 'transformed' to make it look like it was a reading from the primary sensor's point of view. Like the math code, they are written in a functional style to use the elegant bottom-up form of coding that lets us calibrate and reconstruct a skeleton vector by vector, and joint by joint.
- Aggregators: these take a series of skeletons that have already been 'reconstructed', and reduce them to a single skeleton by taking the reading with the highest confidence for each joint.
- `server-helpers/`: some helpers for setting up a server with multiple interacting clients which supply and receive data. These helpers could work with any type of server and are not specific to the supplied socket.io example.

## Set up
1. Install Node.js if necessary from your favorite source.
2. `cd` into the project folder in a terminal.
3. Run `npm install` to all the dependencies.
4. You are ready to run the example server or the unit tests.

## Examples
An example server has been provided which exposes a socket.io interface on `localhost:3000`; start it by running `npm start`. You should be able to connect to this with a compatible socket.io client and start sending skeleton data to it. The example server was originally developed using [mocapjs](https://github.com/themasterchef/mocap.js) as the client and the ZigFu browser plugin as the data source.

## Tests
Unit testing is done with Node.js ports of the QUnit and Sinon.js frameworks. To run the tests, just `cd` into the project folder and run `npm test`.