import React from 'react'

function SelectIndicator(props) {

  return (
    <div className='CheckBox'>
      {
      props.countriesLabels.length !== 0
      ?
      <div>
      <form onSubmit={props.handleSubmit}>
        <input type="text" onChange={props.handleChange} />
        <input type="submit" value="Search" />
      </form>
      <ul>
        {props.labels.map((res, ind) => {
          return <li key={ind} onClick={props.handleSubmit} data-indicator={res[1]}>{res[0]}</li>;
        })}
      </ul>
      </div>
      :
      <h1></h1>
    }
    </div>

  )
} // SelectSeach

export default SelectIndicator
