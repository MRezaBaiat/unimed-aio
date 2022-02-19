import React from 'react';

class ErrorBoundary extends React.Component {
  state: {
    error?: any;
    errInfo?: any;
    info?: any;
  };

  constructor(props) {
    super(props);
    this.state = { error: undefined, errInfo: undefined };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    console.log(error);
    console.log(info);
    this.setState({ error, errInfo: info });
  }

  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      // if (process.env.NODE_ENV === 'development') {
      return (
        <h1>
          {this.state.error.message}
          {this.state.error.stack}
          {this.state.info}
        </h1>
      );
      // }
      // return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
