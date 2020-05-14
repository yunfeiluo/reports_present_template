class DocList extends React.Component {
    constructor(props){
        super(props);
        this.state = {list: true, depth:-1, retrieved_list: {docs_list: []}};
        this.items = this.state.retrieved_list.docs_list;
        this.handleClick = this.handleClick.bind(this);
        this.curr_items = [];
        this.search_attempted = 0;
        this.handle_search();
    }
    
    // get json file from backend
    fetch_docs(url, query_term){
        fetch(url.concat(query_term), {
            method: "GET"
        }).then(response => {
            return response.json()
        }).then(data => {
            // Work with JSON data here
            this.setState({list: true, depth:-1, retrieved_list: data});
            ReactDOM.render(
                <DocList></DocList>,
                document.getElementById('list')
            );
            //console.log(this.state.retrieved_list);
        }).catch(err => {
            console.log('err');
        });
    }
    
    // handling events
    // switch between article and list
    handleClick(item){
        if (item.path != "back"){
            this.curr_items.push(item);
            this.state.depth += 1;
            this.state.list = false;
        }
        else{
            this.curr_items.pop();
            this.state.depth -= 1;
            if (this.state.depth != -1){
                this.state.list = false;
            }
            else{
                this.state.list = true;
            }
        }
        ReactDOM.render(
            <DocList></DocList>,
            document.getElementById('list')
        );
    }

    handle_search(){
        this.search_attempted += 1;
        let query_term = "reports";
        let url = "http://127.0.0.1:5000/";
        // send request to backend, get json file back
        this.fetch_docs(url, query_term);
    }
    
    // rendor stuff
    // load the document
    display_document(){
        const list = [];
        list.push(
            <div id = {"display_doc"}>
                <embed src={this.curr_items[this.state.depth].path} width="100%" height="650px" />
            </div>
        );
        for (let item of this.curr_items[this.state.depth].docs) {
        list.push(
            <div id = {item.id}>
                <div className = "doc" onClick = {() => this.handleClick(item)}>
                <div><h3>{item.title}</h3></div>
                <div>{item.summery}</div>
                <div><u>(Click to view the full article)</u></div>
                </div>
                <div className = "split"><hr /></div>
            </div>
        );
        }
        list.push(<div><button className ="back_button" onClick = {()=> this.handleClick({path: "back"})}><p>Back</p></button></div>);
        return (<div>{list}</div>);
    }
    
    // load the list
    generate_list(){
        this.items = this.state.retrieved_list.docs_list;
        // push to the list tag
        const list = [];
        for (let item of this.items) {
        list.push(
            <div id = {item.id}>
                <div className = "doc" onClick = {() => this.handleClick(item)}>
                <div><h3>{item.title}</h3></div>
                <div>{item.summery}</div>
                <div><u>(Click to view the full article)</u></div>
                </div>
                <div className = "split"><hr /></div>
            </div>
        );
        }
        return (<div>{list}</div>);
    }
    
    // rendor funcion
    render () {
        if (this.state.list){
            return this.generate_list();
        }
        else{
            return this.display_document();
        }
    }
}

// Apply
ReactDOM.render(
    <DocList></DocList>,
    document.getElementById('list')
);