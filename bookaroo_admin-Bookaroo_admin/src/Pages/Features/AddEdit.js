import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import ApiClient from '../../methods/api/apiClient';
import FormControl from '../../components/common/FormControl';
import { GrSubtractCircle } from 'react-icons/gr';
import { IoMdAddCircleOutline } from 'react-icons/io';
import shared from './shared';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import SelectDropdown from '../../components/common/SelectDropdown';

const AddEdit = ({ isOpen, setIsOpen, form, setForm, getFeaturesListing }) => {
  const [disabled, setDisabled] = useState(false);
  const [featureType, setFeatureType] = useState();
  const typeOptions = [
    { id: "home", name: "Home seeker innovative features" },
    { id: "owner", name: "Owner unique features" },
    { id: "sales-mandats", name: "Sales mandats acquisition" },
    { id: "real-estate", name: "Real-estate services" },
  ]
  useEffect(() => {
    if (isOpen && form?.featureType) setFeatureType(form?.featureType)
    }, [isOpen])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    setDisabled(true)
    let payload = {
      features: form?.data?.map((item) => {
        return ({ featureType, name: item })
      })
    }
    if (form?.id) {
      payload = { id: form?.id, featureType,name: form?.data[0] }
      ApiClient.put(shared?.editApi, payload).then(res => {
        if (res.success) {
          setIsOpen(false)
          setFeatureType("")
          getFeaturesListing()
        }
        setDisabled(false)
      })
    } else {
      ApiClient.post(shared?.addApi, payload)
        .then(res => {
          if (res.success) {
            getFeaturesListing()
            setIsOpen(false)
            setFeatureType("")
          } else {
            const errCount = res?.errors?.filter(item => item?.message === "Feature already exist.");
            if (errCount?.length) {
              toast.error(`${errCount?.length > 1
                ? "Some features already exist"
                : `${errCount[0]?.name} feature already exist`}`);
              setIsOpen(false)
              setFeatureType("")
            }
          }
          setDisabled(false)
        })
        .catch((err) => console.log(err))
    }
  }
  const handleAddMoreInput = (e, index) => {
    let value = [...form?.data]
    value[index] = e
    setForm((prev) => ({ ...prev, data: value }))
  }
  const handleAddMore = () => {
    const value = [...form?.data, []]
    setForm((prev) => ({ ...prev, data: value }))
  }
  const handleRemoveAddMore = (index) => {
    const value = form?.data?.filter((item, i) => i !== index)
    setForm((prev) => ({ ...prev, data: value }))
  }

  return (
    <>
      <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={() => setIsOpen(true)}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 bg-[#0000006b]">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white  backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className="text-[20px] font-[600] font-medium text-[#003b85] border-[#c1c1c1] border-b p-3">
                {form?.id ? "Edit" : "Add"} Feature
              </DialogTitle>
              <form onSubmit={handleSubmit} className=''>
                <div className=" p-3 min-h-[250px] max-h-[500px] overflow-auto">
                  <div className='mb-4'>
                  <label>Type</label>
                  <SelectDropdown
                    id="statusDropdown"
                    displayValue="name"
                    className="mt-1"
                    theme="search"
                    intialValue={featureType}
                    result={(e) => setFeatureType(e?.value)}
                    options={typeOptions}
                    isClearable={false}
                    required
                  />
                  </div>
                  
                  <label>Name</label>
                  <div className=''>
                  <div className="">
                    {form?.data?.map((item, index) => {
                      return <div key={index} className=" mb-3  flex items-center">
                        <FormControl
                          type="text"
                          name="name"
                          autoComplete="one-time-code"
                          value={item}
                          onChange={(e) => handleAddMoreInput(e, index)}
                          required
                        />
                        {form?.data?.length > 1 &&
                          <div className="bg-red-600 p-3 text-white rounded-lg cursor-pointer ms-3" onClick={e => handleRemoveAddMore(index)}><GrSubtractCircle size={20} /></div>
                        }

                      </div>
                    })}
                  </div>
                  {!form?.id &&
                    <div className="w-fit ml-auto mt-3 bg-primary p-3 text-white rounded-lg cursor-pointer" onClick={e => handleAddMore()}>
                      <IoMdAddCircleOutline size={20} />
                    </div>
                  }
                  </div>
                 
                </div>
                <div className=" border-[#c1c1c1] border-t flex justify-end p-3">
                  <Button
                    className="inline-flex mr-3 items-center gap-2 rounded-md  py-1.5 px-3 text-sm/6 font-semibold  focus:outline-none border border-[#976DD0] text-[#976DD0] "
                    type='button'
                    onClick={() => setIsOpen(false)}
                  >
                    Close     
                  </Button>
                  <Button
                    className={`disabled:cursor-not-allowed inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700`}
                    type='submit'
                    disabled={disabled}
                  >
                    {form?.id ? "Update" : "Save"}
                  </Button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AddEdit;
