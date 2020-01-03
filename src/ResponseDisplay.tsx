import React from 'react';
import './App.css';
import { OutputList, OutputItem } from './lib/baseTypes';

interface ResponseDisplayProps {
  output: OutputList,
}

interface ResponseDisplayState {
}

class ResponseDisplay extends React.Component<ResponseDisplayProps, ResponseDisplayState> {
  formattedOutputItem(item: OutputItem) {
    if (item instanceof Object) {
      return JSON.stringify(item, null, '    ');
    } else {
      return item.toString();
    }
  }

  render() {
    return (
      <div>
        <pre>
          {this.props.output.map(item => this.formattedOutputItem(item)).join("\n")}
        </pre>
      </div>
    );
  }
}

export default ResponseDisplay;
