import React from 'react';

const Modal = (props) => (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-96 p-6">
      <header className="border-b-2 border-gray-300 mb-4">
        <h1 className="text-xl font-semibold">{props.title}</h1>
      </header>
      <section className="modal__content mb-4">
        {props.children}
      </section>
      <section className="flex justify-end space-x-4">
        {props.canCancel && (
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
            onClick={props.onCancel}
          >
            Cancel
          </button>
        )}
        {props.canConfirm && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={props.onConfirm}
          >
            Confirm
          </button>
        )}
      </section>
    </div>
  </div>
);

export default Modal;
