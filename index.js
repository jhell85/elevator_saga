{
  init: function(elevators, floors) {
    console.clear();
    var elevator = elevators[0]; // Let's use the first elevator
    const maxFloors = floors.length - 1

    elevator.on("stopped_at_floor", (floorNum) => {
      console.log("elevator destination", elevator.destinationQueue)

      if (floorNum === maxFloors) {
        elevator.goingDownIndicator(true)
        elevator.goingUpIndicator(false)
      }
      if (floorNum === 0) {
        elevator.goingUpIndicator(true)
        elevator.goingDownIndicator(false)
      }
      else if (elevator.destinationQueue[0] > floorNum) {
        elevator.goingUpIndicator(true)
        elevator.goingDownIndicator(false)
      }
      else {
        elevator.goingDownIndicator(true)
        elevator.goingUpIndicator(false)
      }
    })




    elevator.on("floor_button_pressed", (floorNum) => {
      elevator.goToFloor(floorNum)
      console.log("destination", elevator.destinationQueue)
      console.log("floor_button_pressed", floorNum, "pressed Floors", elevator.getPressedFloors())
    })

    elevator.on("passing_floor", (floorNum, direction) => {
      console.log(direction)
      if (elevator.getPressedFloors().includes(floorNum) &&
        (floors[floorNum].buttonStates.down === "activated" && direction === "down") ||
        (floors[floorNum].buttonStates.up === "activated" && direction === "up")) {
        elevator.goToFloor(floorNum, true)
      }
    })
    floors.forEach(function (floor) {
      console.log(floor)
      floor.on("up_button_pressed down_button_pressed", function () {
        // find an idle elevator if possible
        const choice = floor.floorNum();
        elevator.goToFloor(choice)
      });
    });

    // Whenever the elevator is idle (has no more queued destinations) ...
    elevator.on("idle", function () {
      // let's go to all the floors (or did we forget one?)
      elevator.goToFloor(0);
      elevator.goToFloor(1);
      elevator.goToFloor(2);
    });
  },
  update: function(dt, elevators, floors) {
    // We normally don't need to do anything here
  }
}