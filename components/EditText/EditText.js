import React from "react";
import styles from "./EditText.module.css";
import PropTypes from "prop-types";
import classnames from "classnames";
export class EditText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previousValue: props.defaultValue || "",
      savedValue: props.defaultValue || "",
      editMode: false,
    };
    this.inputRef = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.savedValue && props.value !== null) {
      if (state.editMode) {
        return {
          savedValue: props.value,
        };
      } else {
        return {
          previousValue: props.value,
          savedValue: props.value,
        };
      }
    }
    return null;
  }

  handleClick = () => {
    if (this.props.readonly) return;
    this.setState({
      editMode: true,
    });
    this.props.onEditMode();
  };

  handleBlur = (save = true) => {
    if (this.inputRef.current) {
      const { name, value, validity } = this.inputRef.current;
      if (save && validity.valid && this.state.previousValue !== value) {
        this.props.onSave({
          name,
          value,
          previousValue: this.state.previousValue,
        });
        this.setState({
          savedValue: value,
          previousValue: value,
        });
      } else if (!save) {
        if (this.props.onChange) {
          this.props.onChange(this.state.previousValue);
        }
      }
      this.setState({
        editMode: false,
      });
      this.props.onBlur();
    }
  };

  handleKeydown = (e) => {
    if (e.keyCode === 13 || e.charCode === 13) {
      // enter key
      this.handleBlur();
    } else if (e.keyCode === 27 || e.charCode === 27) {
      // esc key
      this.handleBlur(false);
    }
  };

  handleFocus = (e) => {
    if (this.props.type === "text") {
      e.currentTarget.setSelectionRange(
        e.currentTarget.value.length,
        e.currentTarget.value.length
      );
    }
  };

  render() {
    const {
      id,
      className,
      name,
      label,
      type,
      placeholder,
      inline,
      style,
      readonly,
      value,
      defaultValue,
      onSave,
      onChange,
      onEditMode,
      onBlur,
      ...inputProps
    } = this.props;

    const { editMode, savedValue } = this.state;

    if (!readonly && editMode) {
      if (value !== null) {
        return (
          <input
            {...inputProps}
            data-test="edit-text-input"
            id={id}
            className={classnames(className)}
            style={style}
            ref={this.inputRef}
            type={type}
            name={name}
            onBlur={this.handleBlur}
            onKeyDown={this.handleKeydown}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            autoFocus
            onFocus={this.handleFocus}
          />
        );
      } else {
        return (
          <input
            {...inputProps}
            data-test="edit-text-input"
            id={id}
            className={classnames(className)}
            style={style}
            ref={this.inputRef}
            type={type}
            name={name}
            onBlur={this.handleBlur}
            onKeyDown={this.handleKeydown}
            defaultValue={savedValue}
            autoFocus
            onFocus={this.handleFocus}
          />
        );
      }
    } else {
      return (
        <div
          id={id}
          data-test="edit-text-label"
          className={classnames(
            styles.label,
            {
              [styles.placeholder]: placeholder && !savedValue,
              [styles.readonly]: readonly,
            },
            className
          )}
          onClick={this.handleClick}
          style={style}
        >
          {label || savedValue || placeholder}
        </div>
      );
    }
  }
}

EditText.defaultProps = {
  id: null,
  name: null,
  className: null,
  type: "text",
  value: null,
  defaultValue: null,
  label: null,
  placeholder: "",
  onSave: () => {},
  onChange: () => {},
  onEditMode: () => {},
  onBlur: () => {},
  inline: false,
  style: {},
  readonly: false,
};

EditText.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  onSave: PropTypes.func,
  onChange: PropTypes.func,
  onEditMode: PropTypes.func,
  onBlur: PropTypes.func,
  inline: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  readonly: PropTypes.bool,
};
