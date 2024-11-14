const template = (variables, { tpl }) => {
  return tpl`
export const ${variables.componentName.slice(3)} = (${variables.props}) => (
  ${variables.jsx}
);
`;
};

export default template;
