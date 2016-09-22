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

    this.error = props.validate(initialValue);

    this.state = {
      value: initialValue,
      touched: false,
    };

    this.hasError = () => !!this.error;

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

      this.setState({ value });
      this.props.onChange(value);
    };
  }

  componentDidMount() {
    const { registerField } = this.context[contextKey];
    this.unregisterField = registerField(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!isControlled(nextProps)) return;
    const { value } = nextProps;
    this.setState({ value });
  }

  componentWillUpdate(nextProps, nextState) {
    const { validate } = nextProps;
    const { value } = nextState;
    if (validate === this.props.validate && value === this.state.value) return;
    this.error = nextProps.validate(nextState.value);
  }

  componentWillUnMount() {
    this.unregisterField();
  }

  render() {
    const { state, touch, update, error } = this;
    const { children } = this.props;
    return children(Object.assign({}, state, { error, touch, update }));
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
