import React, { PropTypes, Component } from 'react';
import { contextKey, contextTypes } from './constants';

export default class Form extends Component {
  constructor(props) {
    super(props);

    this.fields = [];

    this.registerField = (field) => {
      this.fields.push(field);

      return () => {
        this.fields = this.fields.filter(item => item !== field);
      };
    };

    this.onSubmit = (e) => {
      let hasError = false;

      this.fields.forEach(field => {
        field.touch();
        if (hasError) return;
        hasError = field.hasError();
      });

      if (hasError) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      this.props.onSubmit(e);
    };
  }

  getChildContext() {
    const { registerField } = this;

    return {
      [contextKey]: { registerField },
    };
  }

  render() {
    return (
      <form
        {...this.props}
        onSubmit={this.onSubmit}
      />
    );
  }
}

Form.propTypes = {
  onSubmit: PropTypes.func,
};

Form.defaultProps = {
  onSubmit() {},
};

Form.childContextTypes = contextTypes;
