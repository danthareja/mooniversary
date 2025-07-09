import React, { FocusEvent, KeyboardEvent, ChangeEvent } from "react";
import { cn } from "@/lib/utils";

interface EditTextProps {
  id?: string;
  name?: string;
  className?: string;
  type?: string;
  value?: string | null;
  defaultValue?: string;
  label?: string;
  placeholder?: string;
  onSave?: (data: {
    name: string;
    value: string;
    previousValue: string;
  }) => void;
  onChange?: (value: string) => void;
  onEditMode?: () => void;
  onBlur?: () => void;
  inline?: boolean;
  style?: React.CSSProperties;
  readonly?: boolean;
  // Allow additional input props
  [key: string]: unknown;
}

interface EditTextState {
  previousValue: string;
  savedValue: string;
  editMode: boolean;
  isInvalid: boolean;
}

export class EditText extends React.Component<EditTextProps, EditTextState> {
  private inputRef: React.RefObject<HTMLInputElement | null>;

  constructor(props: EditTextProps) {
    super(props);
    this.state = {
      previousValue: props.defaultValue || "",
      savedValue: props.defaultValue || "",
      editMode: false,
      isInvalid: false,
    };
    this.inputRef = React.createRef<HTMLInputElement>();
  }

  static getDerivedStateFromProps(props: EditTextProps, state: EditTextState) {
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
    this.props.onEditMode?.();
  };

  handleBlur = () => {
    if (this.inputRef.current) {
      const { name, value, validity } = this.inputRef.current;
      if (validity.valid && this.state.previousValue !== value) {
        this.props.onSave?.({
          name: name || "",
          value,
          previousValue: this.state.previousValue,
        });
        this.setState({
          savedValue: value,
          previousValue: value,
        });
      } else {
        if (this.props.onChange) {
          this.props.onChange(this.state.previousValue);
        }
      }
      this.setState({
        editMode: false,
        isInvalid: false,
      });
      this.props.onBlur?.();
    }
  };

  handleKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 || e.charCode === 13) {
      // enter key
      this.handleBlur();
    } else if (e.keyCode === 27 || e.charCode === 27) {
      // esc key - cancel edit
      if (this.props.onChange) {
        this.props.onChange(this.state.previousValue);
      }
      this.setState({
        editMode: false,
        isInvalid: false,
      });
      this.props.onBlur?.();
    }
  };

  handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (this.props.type === "text") {
      e.currentTarget.setSelectionRange(
        e.currentTarget.value.length,
        e.currentTarget.value.length,
      );
    }
  };

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    const { validity } = e.target;

    // Update invalid state based on HTML5 validation
    this.setState({
      isInvalid: !validity.valid,
    });

    if (onChange) {
      onChange(e.target.value);
    }
  };

  render() {
    const {
      id,
      className,
      name,
      label,
      type = "text",
      placeholder = "",
      style = {},
      readonly = false,
      value,
      ...inputProps
    } = this.props;

    const { editMode, savedValue, isInvalid } = this.state;

    if (!readonly && editMode) {
      const inputClasses = cn(
        "inline border-none bg-transparent text-inherit text-center bg-gray-600/40 focus:outline-none",
        isInvalid ? "shadow-[0_3px_0_0_#ff5722]" : "shadow-[0_3px_0_0_#facc15]", // #facc15 is yellow-400
        className,
      );

      if (value !== null) {
        return (
          <input
            {...inputProps}
            data-test="edit-text-input"
            id={id}
            className={inputClasses}
            style={style}
            ref={this.inputRef}
            type={type}
            name={name}
            onBlur={this.handleBlur}
            onKeyDown={this.handleKeydown}
            value={value}
            onChange={this.handleChange}
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
            className={inputClasses}
            style={style}
            ref={this.inputRef}
            type={type}
            name={name}
            onBlur={this.handleBlur}
            onKeyDown={this.handleKeydown}
            onChange={this.handleChange}
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
          className={cn(
            "overflow-hidden text-ellipsis whitespace-nowrap transition-all duration-200 min-h-[28px]",
            type === "number"
              ? "inline leading-inherit text-inherit shadow-[0_3px_0_0_#facc15]"
              : "",
            {
              "text-gray-400": placeholder && !savedValue,
              "cursor-auto": readonly,
              "cursor-pointer hover:bg-gray-200/40": !readonly,
            },
            className,
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
