import React from 'react'

const SelectButton = ({ children, selected, onClick }) => {
    return (
        <button type="button" onClick={onClick} className={`select-button${selected ? ' selected' : ''}`} aria-pressed={selected}>{children}</button>
    )
}

export default SelectButton
