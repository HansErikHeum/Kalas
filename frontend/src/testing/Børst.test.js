import React from "react";
import Borst from "../components/pages/Borst";
import { shallow } from "enzyme";
import "@testing-library/jest-dom/extend-expect";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

describe("<Borst />", () => {
  let wrapper;

  it("Has the initial state", () => {
    wrapper = shallow(<Borst />);
    expect(wrapper.state()).toEqual({
      username: undefined,
      members: [],
      bgColor: ["#E53030", "#392D84", "#4B4B4A", "#29DCCB", "#1D3341"],
      selectedColor: "#4B4B4A",
      selectedQuestion: " ",
      currentName: " ",
      currentIndex: 0,
      promiseIsResolved: false,
      spørsmålDatabase: [],
      nyeSpørsmål: [],
      button: false,
    });
  });
});

describe("<Borst />", () => {
  let wrapper;

  it("Checks if selectedQuestion changes after running GetRandomQuestion", () => {
    wrapper = shallow(<Borst />);
    expect(wrapper.state()).toEqual({
      username: undefined,
      members: [],
      bgColor: ["#E53030", "#392D84", "#4B4B4A", "#29DCCB", "#1D3341"],
      selectedColor: "#4B4B4A",
      selectedQuestion: " ",
      currentName: " ",
      currentIndex: 0,
      promiseIsResolved: false,
      spørsmålDatabase: [],
      nyeSpørsmål: [],
      button: false,
    });
    wrapper.instance().GetNextQuestion();
    expect(wrapper.state()).toEqual({
      username: undefined,
      members: [],
      bgColor: ["#E53030", "#392D84", "#4B4B4A", "#29DCCB", "#1D3341"],
      selectedColor: "#4B4B4A",
      selectedQuestion: "Det er dessverre ikke flere spørsmål",
      currentName: " ",
      currentIndex: 0,
      promiseIsResolved: false,
      spørsmålDatabase: [],
      nyeSpørsmål: [],
      button: true,
    });
  });
});
