var current = new Date();

function formatmsg(username, text) {
    return {
        username,
        text,
        time: current.toLocaleTimeString()
    }
}

function formatlocation(username, lat, lng) {
    return {
        username,
        url: `https://www.google.com/maps?q=${lat},${lng}`,
        time: current.toLocaleTimeString()
    }
}

module.exports = { formatmsg, formatlocation };