import './GiphySearch.css'
const GiphySearch = () => {
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formObject = Object.fromEntries(formData.entries());
        console.log("🚀 ~ GiphySearch ~ formObject:", formObject);
    }

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit} className='search-form'>
                <input type="text" className="search-input" placeholder='Find the perfect GIF to express your mood!' name='q' />
                <button>Search</button>
            </form>

        </div>
    )
}

export default GiphySearch;