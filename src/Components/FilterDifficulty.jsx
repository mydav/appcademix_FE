import React, { Component } from "react";
import { Container } from "reactstrap";
import { Dropdown, Input } from "semantic-ui-react";
import ".../../semantic-ui-css/semantic.min.css";

const tagOptions = [
  {
    key: "Title",
    text: "Title",
    value: "Title",
    label: { color: "", empty: true, circular: true }
  },
  {
    key: "Difficulty",
    text: "Difficulty",
    value: "Difficulty",
    label: { color: "", empty: true, circular: true }
  },
  {
    key: "Category",
    text: "Category",
    value: "Category",
    label: { color: "", empty: true, circular: true }
  }
];

class FilterComponent extends Component {
  dropdownRef = React.createRef();

  state = {
    value: "",
    searchQuery: "",
    filteredList: tagOptions
    //   classname:""
  };

  onChange = (e, data) => {
    console.log(e);
    this.setState({
      dropDownText: data.value
    });
  };

  onInputClick = e => {
    e.preventDefault();
    e.stopPropagation();
    console.log(e.target.name);
  };

  handleChange = (_e, { value }) => {
    console.log(value)
    this.setState({ value });
    let string = value.toLowerCase()
    this.props.filter(string) //classname: _e.currentTarget.firstElementChild.className
  };
  searchFn = (_e, searchQuery) => {
    const filteredList = tagOptions.filter(
      item => !searchQuery || item.value.includes(searchQuery)
    );
    return filteredList;
  };
  handleSearchChange = (_e, { searchQuery }) => {
    const filteredList = this.searchFn(_e, searchQuery);
    this.setState({ searchQuery, filteredList });
  };

  handleClose = (_e, { searchQuery }) => {
    this.setState({ searchQuery: "", filteredList: tagOptions });
  };

  handleItemClick = (_e, x) => {
    this.dropdownRef.current.handleItemClick(_e, x);
  };

  render() {
    return (
      <>
        <Dropdown
          ref={this.dropdownRef}
          icon="sort"
          floating
          labeled
          button
          className="icon"
          clearable={true}
          placeholder="Sort Posts"
          onChange={this.handleChange}
          onClose={this.handleClose}
          value={this.state.value}
          text={this.state.value}
        >
          <Dropdown.Menu>
            <Dropdown.Divider />
            <Dropdown.Menu scrolling>
              {this.state.filteredList.map(option => (
                <Dropdown.Item
                  active={option.value === this.state.value}
                  key={option.value}
                  {...option}
                  onClick={this.handleItemClick}
                />
              ))}
            </Dropdown.Menu>
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  }
}

export default FilterComponent;
