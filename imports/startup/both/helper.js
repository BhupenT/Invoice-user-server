function checkValue(Array, value) {
    let test = false;

    for (let index = 0; index < Array.length; index++) {
        if(Array[index]['_id'] == value) {
            test = true;
            break;
        }
    }
    return test;
}