function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
};

function sum(list_numbers) {
    return list_numbers.reduce((x, y) => x + y, 0)
}

function sort(list_numbers, asc = true) {
    list_copy = [...list_numbers]
    list_copy.sort((a, b) => a - b)
    if (!asc) {
        list_copy = list_copy.reverse()
    }
    return list_copy
}

function zip(list_a, list_b) {
    zipped_list = []
    for (let i = 0; i < list_a.length; i++) {
        zipped_list.push([list_a[i], list_b[i]])
    }

    return zipped_list
}

function list(iterable) {
    return Array.from(iterable)
}
