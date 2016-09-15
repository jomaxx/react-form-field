import { PropTypes, Component } from 'react';
import { contextKey, contextTypes } from './constants';

function isControlled(props = {}) {
  return typeof props.value !== 'undefined';
}

export default class Field extends Component {
  constructor(props) {
    super(props);

    const initialValue = (
      isControlled(props)
      ? props.value
      : props.defaultValue
    );

    this.state = {
      value: initialValue,
      error: props.validate(initialValue),
      touched: false,
    };

    this.hasError = () => !!this.state.error;

    this.touch = () => {
      this.setState({ touched: true });
    };

    this.update = (e, { silent } = {}) => {
      const value = e && e.target ? e.target.value : e;

      if (typeof value === 'function') {
        this.update(value(this.state.value));
        return;
      }

      if (!silent) {
        this.touch();
      }

      if (!isControlled(this.props)) {
        this.setState({
          value,
          error: this.props.validate(value),
        });
      }

      this.props.onChange(value);
    };
  }

  componentDidMount() {
    const { registerField } = this.context[contextKey];
    this.unregisterField = registerField(this);
  }

  componentWillReceiveProps(nextProps) {
    const value = isControlled(nextProps) ? nextProps.value : this.state.value;
    const validate = nextProps.validate;

    if (value === this.state.value && validate === this.props.validate) return;

    this.setState({
      value,
      error: validate(value),
    });
  }

  componentWillUnMount() {
    this.unregisterField();
  }

  render() {
    const { state, touch, update } = this;
    const { children } = this.props;
    return children(Object.assign({}, state, { touch, update }));
  }
}

Field.propTypes = {
  value: PropTypes.any,
  defaultValue: PropTypes.any,
  children: PropTypes.func.isRequired,
  validate: PropTypes.func,
  onChange: PropTypes.func,
};

Field.defaultProps = {
  validate() {},
  onChange() {},
};

Field.contextTypes = contextTypes;
