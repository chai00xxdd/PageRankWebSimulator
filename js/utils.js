function getRandomItem(arr) {
  // get random index value
  const randomIndex = Math.floor(Math.random() * arr.length);

  // get random item
  const item = arr[randomIndex];

  return item;
}

function accept_prob(prob) {
  return Math.random() < prob;
}

function remove_from_list(list, value) {
  return list.filter((x) => x != value);
}



function create_cy(container, node_size = 50) {
  const cy = cytoscape({
    container: container,
    userPanningEnabled: false,
    panningEnabled: true,
    style: [
      {
        selector: "edge",
        style: {
          "curve-style": "bezier",
          "target-arrow-shape": "triangle",
        },
      },
      {
        selector: "node",
        style: {
          content: "data(name)",
          width: node_size + "px",
          height: node_size + "px",
        },
      },
    ],
  });
  cy.userZoomingEnabled(false);
  return cy;
}

function get_random_number(start = 1, end) {
  if (!end) {
    end = start
    start = 1
  }

  diff = end - start + 1
  return start + parseInt(Math.random() * diff)

}

function throw_if_nums_not_in_range(nums, start, end) {
  if (!check_nums_in_range(nums, start, end)) {
    throw_exception(ExceptionType.OUT_OF_RANGE, `not in range [${start},${end}]`)
  }
}

function check_nums_in_range(nums, start, end) {
  return nums.filter(x => !(x >= start && x <= end)).length == 0;
}

function throw_exception(type, reason) {
  throw {
    type: type,
    reason: reason,
    to_string: () => { return reason; }
  }
}

class ExceptionType {
  static ERROR = 'error'
  static OUT_OF_RANGE = 'out_of_range'
}



