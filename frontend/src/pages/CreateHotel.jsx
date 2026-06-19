import { useState } from "react";
import api from "../api/axios";

function CreateHotel() {

  const [form, setForm] =
    useState({});

  const [image, setImage] =
    useState(null);

  const submit =
    async e => {

      e.preventDefault();

      const data =
        new FormData();

      Object.keys(form).forEach(
        key =>
          data.append(
            key,
            form[key]
          )
      );

      data.append(
        "image",
        image
      );

      await api.post(
        "/hotel/create",
        data
      );

      alert("Hotel Created");
    };

  return (
    <div className="container">

      <h2>Create Hotel</h2>

      <form onSubmit={submit}>

        <input
          placeholder="Title"
          onChange={e =>
            setForm({
              ...form,
              title:
                e.target.value
            })
          }
        />

        <input
          placeholder="Location"
          onChange={e =>
            setForm({
              ...form,
              location:
                e.target.value
            })
          }
        />

        <input
          placeholder="Price"
          onChange={e =>
            setForm({
              ...form,
              price:
                e.target.value
            })
          }
        />

        <input
          type="file"
          onChange={e =>
            setImage(
              e.target.files[0]
            )
          }
        />

        <button>
          Create
        </button>

      </form>

    </div>
  );
}

export default CreateHotel;