import React from 'react';
import './App.css';
import QueryList from './QueryList';
import QueryDisplay from './QueryDisplay';
import ResponseDisplay from './ResponseDisplay';
import { queries } from './lib/queries';
import { QueryKey, QueryInfo, OutputList } from './lib/baseTypes';
import EsClient from './lib/EsClient';

interface AppProps {
}

interface AppState {
  selectedQueryKey: QueryKey | null,
  activeQuery: QueryInfo | null,
  output: OutputList,
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      selectedQueryKey: null,
      activeQuery: null,
      output: [],
    };

    this.esSetup = this.esSetup.bind(this);
    this.esTeardown = this.esTeardown.bind(this);
    this.onQuerySelected = this.onQuerySelected.bind(this);
    this.onExplain = this.onExplain.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  async esSetup(event: React.MouseEvent<HTMLButtonElement>) {
    const output = await new EsClient().setup();
    this.setState({ output });
  }

  async esTeardown(event: React.MouseEvent<HTMLButtonElement>) {
    const output = await new EsClient().teardown();
    this.setState({ output });
  }

  onQuerySelected(queryKey: QueryKey) {
    this.setState({
      selectedQueryKey: queryKey,
      activeQuery: queries(queryKey),
    });
  }

  async onExplain(queryInfo: QueryInfo) {
    const output = await new EsClient().explain(queryInfo);
    this.setState({ output });
  }

  async onSearch(queryInfo: QueryInfo) {
    const output = await new EsClient().search(queryInfo);
    this.setState({ output });
  }

  render() {
    return (
      <div className="App">
        <div className="container-fluid">
          <button className="btn" onClick={this.esSetup}>Set up ES</button>
          <button className="btn" onClick={this.esTeardown}>Tear down ES</button>
        </div>
        <div className="container-fluid">
          <div className="col-md-6">
            <QueryList onQuerySelected={this.onQuerySelected}></QueryList>
            <QueryDisplay query={this.state.activeQuery} onExplain={this.onExplain} onSearch={this.onSearch}></QueryDisplay>
          </div>
          <div className="col-md-6">
            <ResponseDisplay output={this.state.output}></ResponseDisplay>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
