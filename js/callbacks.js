class CallBacks {
    constructor() {
        this.callbacks = []
    }

    add(callback) {
        this.callbacks.push(callback)
    }
    remove(callback) {
        this.callbacks = this.callbacks.filter(x => x != callback)
    }
    call_all(call_back_data) {
        this.callbacks.forEach(callback => {
            callback(call_back_data)
        })
    }
}