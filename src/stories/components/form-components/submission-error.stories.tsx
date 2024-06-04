import { Meta, StoryObj } from '@storybook/react';
import { useState, FormEventHandler } from 'react';
import { SubmissionError } from '@/components/form-components/submission-error';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';
import { PageContainer } from '@/components/utils/page-container';

const meta: Meta<typeof SubmissionError> = {
  component: SubmissionError,
};

export default meta;

function FormWithSubmissionError() {
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit: FormEventHandler = e => {
    e.preventDefault();
    setErrorMessage('Oops, something went wrong. Please try again.');
  };

  return (
    <GlobalStylesProvider>
      <PageContainer>
        {!!errorMessage && <SubmissionError text={errorMessage} />}
        <form
          onSubmit={onSubmit}
          style={{ marginLeft: '30px', marginRight: '30px' }}
        >
          <h1>
            <span className="underline">Sample</span>&nbsp;Form
          </h1>
          <p style={{ marginTop: '24px', marginBottom: '24px' }}>
            Click &quot;submit&quot; to reveal the error message.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="submit"
              className="btn_gradient btn_lg"
              style={{ width: '283px' }}
            >
              Submit
            </button>
          </div>
        </form>
      </PageContainer>
    </GlobalStylesProvider>
  );
}

type Story = StoryObj<typeof SubmissionError>;

export const FormWithError: Story = {
  render: FormWithSubmissionError,
};
