import Button from "../Button/Button.js"

const Navbar = ({onSave, ...props}) => {

    return (
        <nav className={'navbar'}>
            <Button onClick={onSave} text={'Save Changes'} />
        </nav>
    )
}

export default Navbar