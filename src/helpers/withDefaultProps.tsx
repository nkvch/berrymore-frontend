import React from 'react';

type DefaultProps<P> = Partial<P>;

function withDefaultProps<P extends JSX.IntrinsicAttributes, DP extends DefaultProps<P>>(
  defaultProps: DP,
  Component: React.ComponentType<P>,
) {
  type Props = DP & Omit<P, keyof DP>;

  const WithDefaultProps = (props: Props) => {
    const propsWithDefaults = { ...defaultProps, ...props } as unknown as P;

    return <Component {...propsWithDefaults} />;
  };

  WithDefaultProps.displayName = `withDefaultProps(${Component.displayName || Component.name})`;

  return WithDefaultProps;
}

export default withDefaultProps;
