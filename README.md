# reconstruct-o-matic

A machine vision multi-view scene reconstruction system that aggregates OpenNI data from multiple motion capture sensors to create one coherent reconstruction of the object(s) of interest.

For now, the system only runs in a Node.js server environment, but most of the library code is independent of the Node environment and could be used in other places, including your own applications.

## Build status

![Travis CI](https://travis-ci.org/themasterchef/reconstruct-o-matic.svg?branch=master)

## The idea behind it
Anybody who has used a Kinect will have noticed that if you put your hand behind your back, the Kinect cannot see it any more because it is obviously just a camera viewing the scene from one position. Depending on your application, occlusion of limbs could be a minor annoyance or a major problem. To counter this, we can use two or three Kinects to capture the subject from multiple angles, meaning that if a limb is hidden from one sensor, another sensor can still see it.

This arrangement also extends the overall area which can be monitored: whereas a single Kinect has a nominal maximum range of 3.5 metres ([Primesense Inc. 2011](http://www.openni.org/wp-content/uploads/2013/02/NITE-Algorithms.pdf)), a multiple Kinect setup could potentially support double this range, maybe even more, depending on the exact operational conditions.

## Principal components
- `math/`: a body of math-heavy 'library' code written in a mostly functional style to eliminate as much error-prone mutable state as possible while increasing its flexibility.
- Calibrators: a series of modules which calibrate a secondary sensor so that its subsequent data input can be 'transformed' to make it look like it was a reading from the primary sensor's point of view. Like the math code, they are written in a functional style to use the elegant bottom-up form of coding that lets us calibrate and reconstruct a skeleton vector by vector, and joint by joint.
- Aggregators: these take a series of skeletons that have already been 'reconstructed', and reduce them to a single skeleton by taking the reading with the highest confidence for each joint.
- `server-helpers/`: some helpers for setting up a server with multiple interacting clients which supply and receive data. These helpers could work with any type of server and are not specific to the supplied socket.io example.

## Set up
1. Install Node.js if necessary from your favorite source.
2. Run `npm install` to all the dependencies.
3. Run the example server or the unit tests.

## Examples
An example server has been provided which exposes a socket.io interface on `localhost:3000`; start it by running `npm start`. You should be able to connect to this with a compatible socket.io client and start sending skeleton data to it. The example server was originally developed using [mocapjs](https://github.com/themasterchef/mocap.js) as the client and the ZigFu browser plugin as the data source.

## Using for calibration alone
If your app only uses this module for calibration, you will want to use the `SkeletonCalibrator#calibrateSkeleton(refSkeleton, otherSkeleton)` function to determine the rotation and position deltas between each pair of your skeletons.

## Tests
Unit testing is done with Node.js ports of the QUnit and Sinon.js frameworks. To run the tests, just `cd` into the project folder and run `npm test`.

## Partners
Back in the day, [Nodejitsu](https://www.nodejitsu.com/) kindly provided a free server instance, which we used to test the code in pseudo-production mode using multiple devices.
