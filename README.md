# react-kb-form

Form validation hook library for enterprise scale react applications

## Installation

Use the package manager [npm](https://www.npmjs.com/package/react-kb-form) to install react-kb-form.

```bash
npm i react-kb-form
```

## Simple Usage

```javascript
import { useKBform } from "react-kb-form";

const {
  _register,
  _envMode,
  _handleSubmit,
  watchState,
  formState,
  errorState,
  formStatus,
} = useKBform();

<form ref={_register} _formname="form" onSubmit={_handleSubmit}>
  <input name="surname" _required="true" />
  {errorState.surname}

  <button type="submit">submit</button>
</form>;

useEffect(() => {
  if (formState) {
    console.log(formState.form);
  }
}, [formState]);
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
