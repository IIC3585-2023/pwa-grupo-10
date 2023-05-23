const apiKey = "nWprVPSy88c4Z5TpiDWrwSF7vmVlS3ry"

async function fetchTrending() {
    const res = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=25`);
    const json = await res.json();

    console.log(json.data)
    const container = document.getElementsByClassName("container")
    console.log("aaaaaaaaaaaa", container)
    let output = ""
    json.data.forEach(({id}) => {
        output += `<img id=${id} alt=${id} src=https://i.giphy.com/media/${id}/giphy.webp /><br />`
    })
    container[0].innerHTML = output
}

window.addEventListener('load', async e => {
    await fetchTrending();

    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('serviceWorker.js');
            console.log('SW registered');

        } catch (error) {
            console.log('SW failed');

        }
    }
});
