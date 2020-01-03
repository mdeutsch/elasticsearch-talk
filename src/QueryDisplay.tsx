import React from 'react';
import './QueryDisplay.css';
import { QueryInfo, QueryKey } from './lib/baseTypes';

interface QueryDisplayProps {
  query: QueryInfo | null,
  onExplain: (queryInfo: QueryInfo) => void;
  onSearch: (queryInfo: QueryInfo) => void;
}

interface QueryDisplayState {
  prevQueryKey?: QueryKey | null,
  indices?: string,
  queryBody?: string,
}

class QueryDisplay extends React.Component<QueryDisplayProps, QueryDisplayState> {
  constructor(props: QueryDisplayProps) {
    super(props);
    this.state = {};

    this.handleIndicesChange = this.handleIndicesChange.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.onFormatClicked = this.onFormatClicked.bind(this);
    this.currentQueryInfo = this.currentQueryInfo.bind(this);
    this.onExplainClicked = this.onExplainClicked.bind(this);
    this.onSearchClicked = this.onSearchClicked.bind(this);
  }

  static getDerivedStateFromProps(props: QueryDisplayProps, state: QueryDisplayState): QueryDisplayState {
    if (props.query && (props.query.key !== state.prevQueryKey)) {
      return {
        prevQueryKey: props.query.key,
        indices: props.query.indices,
        queryBody: JSON.stringify(props.query.body, null, '    '),
      };
    } else if (!props.query) {
      return {
        prevQueryKey: null,
        indices: "",
        queryBody: "",
      };
    } else {
      return {};
    }
  }

  handleIndicesChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({indices: event.currentTarget.value});
  }

  handleQueryChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({queryBody: event.currentTarget.value});
  }

  onFormatClicked(event: React.MouseEvent<HTMLButtonElement>) {
    this.setState({
      queryBody: JSON.stringify(JSON.parse(this.state.queryBody as string), null, '    '),
    })
  }

  onExplainClicked(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    this.props.onExplain(this.currentQueryInfo());
  }

  onSearchClicked(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    this.props.onSearch(this.currentQueryInfo());
  }

  currentQueryInfo(): QueryInfo {
    return {
      key: (this.props.query as QueryInfo).key,
      indices: (this.state.indices as string),
      body: JSON.parse((this.state.queryBody as string)),
    };
  }

  render() {
    if (this.props.query) {
      return (
        <div className="query-display">
          <h3>
            Query: "{this.props.query.key}"
            <button type="button" className="btn" onClick={this.onFormatClicked}>Format</button>
            <button type="button" className="btn" onClick={this.onExplainClicked}>Explain</button>
            <button type="button" className="btn btn-default" onClick={this.onSearchClicked}>Run query</button>
          </h3>
          <form onSubmit={event => event.preventDefault()}>
            <div className="form-group">
              <label htmlFor="indices-input">Indices</label>
              <input type="text" id="indices-input" className="form-control" value={this.state.indices} onChange={this.handleIndicesChange} />
            </div>
            <div className="form-group">
              <label htmlFor="query-input">Query</label>
              <textarea id="query-input" className='form-control' value={this.state.queryBody} onChange={this.handleQueryChange} />
            </div>
          </form>
        </div>
      );
    } else {
      return (
        <div className="query-display">
          <h3>No query selected</h3>
        </div>
      );
    }
  }
}

export default QueryDisplay;
