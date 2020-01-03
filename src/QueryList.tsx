import React from 'react';
import './App.css';
import { QueryKey } from './lib/baseTypes';
import { keys as queryKeys } from './lib/queries';

interface QueryListProps {
  onQuerySelected: (key: QueryKey) => void,
}

interface QueryListState {
  queryKeys: Array<QueryKey>,
}

class QueryList extends React.Component<QueryListProps, QueryListState> {
  constructor(props: QueryListProps) {
    super(props);
    this.state = {
      queryKeys: queryKeys(),
    };

    this.onQueryClicked = this.onQueryClicked.bind(this);
  }

  onQueryClicked(event: React.MouseEvent<HTMLButtonElement>) {
    const queryKey = event.currentTarget.getAttribute("data-query-key") || "";
    this.props.onQuerySelected(queryKey);
  }

  render() {
    return (
      <div>
        <h3>Queries</h3>
        <ul>
          {this.state.queryKeys.map(key => this.queryItem(key))}
        </ul>
      </div>
    );
  }

  queryItem(key: QueryKey) {
    return (
      <li key={key}>
        <button className="btn" onClick={this.onQueryClicked} key={key} data-query-key={key}>{key}</button>
      </li>
    );
  }
}

export default QueryList;
