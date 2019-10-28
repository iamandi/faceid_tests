import React from "react";
import Axios from "axios";
import { Layer, Rect, Stage, Group } from "react-konva";
import Konva from "konva";
import posed from "react-pose";

export default class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      canvas: null
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const canvas = this.refs.canvas;
    console.log({ canvas });
    const ctx = canvas.getContext("2d");
    const img = this.refs.image;

    console.log({ img });

    this.setState({ canvas });

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      ctx.font = "40px Courier";
      ctx.fillText(this.props.text, 210, 75);
    };
  }

  handleChange(e) {
    e.preventDefault();
    let file = e.target.files[0];
    console.log({ file });
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      //console.log({ file });
      //console.log(`base64: ${reader.result}`);
      console.log({ reader });

      const base64 = reader.result.slice("data:image/jpeg;base64,".length);
      const instance = Axios.create({
        baseURL: "http://localhost:8080",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      });

      const upload = await instance.post("/facebox/check", { base64 });

      const { facesCount, faces } = upload.data;
      if (facesCount > 0) {
        faces.map(face => {
          const { top, left, width, height } = face.rect;
          this.setState({
            file: URL.createObjectURL(file),
            top,
            left,
            width,
            height
          });
        });
      }
    };
  }

  render() {
    return (
      <div>
        <canvas ref='canvas' width={640} height={425}>
          <img
            ref='image'
            src='https://upload.wikimedia.org/wikipedia/commons/c/c2/Woman_5.jpg'
            alt='user'
          />
        </canvas>
      </div>
    );
  }
}
