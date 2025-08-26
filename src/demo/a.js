import moment from 'moment'

export function go() {
    const date = moment(new Date(), 'YYYY-MM-DD HH:mm:ss')
    return date;
}


function bbb() {
    const a = go()
    console.log(11, a)
    const b = a.clone().add(1, 'days');
    console.log(12, b)
    //const b=a.startOf()
}

bbb()