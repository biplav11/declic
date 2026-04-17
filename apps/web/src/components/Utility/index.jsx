export const Gap = ({ height = 60 }) => (
    <div className="gap" style={height && height !== 60 ? { height } : {}}></div>
)

export const Container = (props) => {
    let newProps = { ...props }
    delete newProps['className']
    let classes = props.className ? `container ${props.className}` : 'container'
    return <div className={classes} {...newProps}>{props.children}</div>
}

export function capitalize(string) {
    return string.split(" ").map((s) => {
        return s[0].toUpperCase() + s.slice(1);
    }).join(" ")
}
