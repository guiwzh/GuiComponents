import React from 'react';
import classNames from 'classnames';


export type ButtonSize='lg' | 'sm';
export type ButtonType = 'primary' | 'default' | 'danger' | 'link';

interface BaseButtonPrpos  {
    className ?: string;
    disabled?: boolean;
    size?: ButtonSize;
    btnType: ButtonType;
    href?: string;
}

type NativeButtonProps = React.ButtonHTMLAttributes<HTMLElement>
type AnchorButtonProps = React.AnchorHTMLAttributes<HTMLElement>
type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps> & BaseButtonPrpos;

export const Button: React.FC<ButtonProps> = (props) => {

    const { className, disabled=false, size, btnType='default', href, children,...restProps} = props;
    const classes = classNames('btn', className, {
        [`btn-${btnType}`]: btnType,
        [`btn-${size}`]: size,
        'disabled': disabled,
    });
    if(btnType === 'link' && href) {
        return (
            <a className={classes} href={href} {...restProps}>
                {children}
            </a>
        )
    } else {
        return (
            <button className={classes} disabled={disabled} {...restProps}>
                {children}
            </button>
        )
    }
}
Button.displayName = 'Button';
export default Button;