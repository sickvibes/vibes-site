import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { propTypes } from 'react-markdown';
import { useHistory } from 'react-router-dom';
import { ThemeConfig } from '../Theme';

type Props = React.HtmlHTMLAttributes<HTMLSpanElement> & {
  navTo?: string;
  externalNavTo?: string;
  disabled?: boolean;
  active?: boolean;
};

const useStyles = makeStyles<ThemeConfig, Props>((theme) => {
  return {
    active: {
      background: (props) => (props.disabled ? 'inherit' : theme.palette.accent.secondary),
      color: (props) => (props.disabled ? 'inherit' : theme.palette.background.main),
    },
    inner: {
      '&:hover': {
        background: (props) => (props.disabled ? 'inherit' : theme.palette.accent.dark),
      },
    },
    button: {
      cursor: (props) => (!props.disabled ? 'pointer' : 'not-allowed'),
      opacity: (props) => (!props.disabled ? 1 : 0.5),
    },
  };
});

export const Button: FunctionComponent<Props> = (props) => {
  const classes = useStyles(props);
  const history = useHistory();

  const { navTo, externalNavTo, ...attr } = props;
  const onClickFromProps = attr.onClick;
  const className = `${props.className ?? ''} ${classes.button}`;

  if (!props.disabled) {
    if (navTo) {
      attr.onClick = (e) => {
        if (onClickFromProps) onClickFromProps(e);
        history.push(navTo);
      };
    } else if (externalNavTo) {
      attr.onClick = (e) => {
        if (onClickFromProps) onClickFromProps(e);
        window.open(externalNavTo, '_blank');
      };
    }
  } else {
    attr.onClick = () => null;
  }

  const innerClassName = `${classes.inner} ${props.active ? classes.active : ''}`;

  return (
    <span {...attr} className={className}>
      [<span className={innerClassName}>{props.children}</span>]
    </span>
  );
};
