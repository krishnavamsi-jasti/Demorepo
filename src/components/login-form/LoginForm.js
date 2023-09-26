import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form, {
  Item,
  Label,
  ButtonItem,
  ButtonOptions,
  RequiredRule,
} from 'devextreme-react/form';
import LoadIndicator from 'devextreme-react/load-indicator';
import notify from 'devextreme/ui/notify';
import { useAuth } from '../../contexts/auth';

import './LoginForm.scss';

export default function LoginForm() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const formData = useRef({ companyname: '', userId: '', password: '' });

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    const { companyname, userId, password } = formData.current;
    setLoading(true);

    const result = await signIn(companyname, userId, password);
    if (!result.isOk) {
      setLoading(false);
      notify(result.message, 'error', 2000);
    }
  }, [signIn]);

  const onCreateAccountClick = useCallback(() => {
    navigate('/create-account');
  }, [navigate]);

  return (
    <form className={'login-form'} onSubmit={onSubmit}>
      <Form formData={formData.current} disabled={loading}>
      <Item
          dataField={'companyname'}
          editorType={'dxTextBox'}
          editorOptions={userNameEditorOptions}
        >
          <RequiredRule message="Company is required" />
          <Label visible={false} />
        </Item>
        <Item
          dataField={'userId'}
          editorType={'dxTextBox'}
          editorOptions={emailEditorOptions}
        >
          <RequiredRule message="Username is required" />
          <Label visible={false} />
        </Item>
        <Item
          dataField={'password'}
          editorType={'dxTextBox'}
          editorOptions={passwordEditorOptions}
        >
          <RequiredRule message="Password is required" />
          <Label visible={false} />
        </Item>
        {/* <Item
          dataField={'rememberMe'}
          editorType={'dxCheckBox'}
          editorOptions={rememberMeEditorOptions}
        >
          <Label visible={false} />
        </Item> */}
        <ButtonItem>
          <ButtonOptions
            width={'100%'}
            type={'default'}
            useSubmitBehavior={true}
          >
            <span className="dx-button-text">
              {
                loading
                  ? <LoadIndicator width={'24px'} height={'24px'} visible={true} />
                  : 'Sign In'
              }
            </span>
          </ButtonOptions>
        </ButtonItem>
        <Item>
          <div className={'link'}>
            <Link to={'/reset-password'}>Forgot password?</Link>
          </div>
        </Item>
        {/* <ButtonItem>
          <ButtonOptions
            text={'Create an account'}
            width={'100%'}
            onClick={onCreateAccountClick}
          />
        </ButtonItem> */}
      </Form>
    </form>
  );
}

const userNameEditorOptions = { stylingMode: 'filled', placeholder: 'Company Name', mode: 'companyname' };
const emailEditorOptions = { stylingMode: 'filled', placeholder: 'Username', mode: 'userId' };
const passwordEditorOptions = { stylingMode: 'filled', placeholder: 'Password', mode: 'password' };
// const rememberMeEditorOptions = { text: 'Remember me', elementAttr: { class: 'form-text' } };
