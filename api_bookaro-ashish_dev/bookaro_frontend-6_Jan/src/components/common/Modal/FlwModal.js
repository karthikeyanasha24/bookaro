import {
    Checkbox,
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import SelectDropdown from "../SelectDropdown";

const FlwModal = ({ flwModal, setflwModal, flwItem, refetch, allfilters, existData, keyData, data, setData }) => {
    const { user } = useSelector((state) => state);
    const [exist, setExist] = useState(false);
    const [name, setName] = useState("");
    const [folders, setFolders] = useState([]);
    const [form, setForm] = useState({
        id: "",
    });
    const selectedProp = folders?.find((itm) => itm.id === form.id);
    const validate = () => {
        if (exist) {
            if (!name || name?.trim() === "") {
                toast.error("Enter folder name");
                return false;
            }
        } else {
            if (!form.id) {
                toast.error("Select folder");
                return false;
            }
        }
        return true;
    };

    const isFollow = () => {
        if (!validate()) return;
        const isliked = flwItem?.followunfollows_details ? false : true;
        let method = "put";
        let url = `followUnfollow/update`;
        let value = existData ?
            {
                user_id: user?._id,
                property_id: flwItem?._id || flwItem?.id,
                follow_unfollow: keyData == "follow" ? true : false,
                p2pFollow: keyData == "follow" ? true : "",
            }
            : {
                user_id: user?._id,
                property_id: flwItem?._id || flwItem?.id || flwItem?.propertyDetail?._id,
                follow_unfollow: isliked,
            };
        if (keyData == "unfollow") {
            delete value.p2pFollow;
        }
        loader(true);
        ApiClient.allApi(url, value, method).then((res) => {
            if (res.success) {
                if (!existData) { refetch(allfilters || {}) };
                if (existData) {
                    const updatedData = data.map((d) =>
                        d._id === flwItem._id || d.id === flwItem.id
                            ? { ...d, isFollowed: keyData == "follow" ? true : false }
                            : d
                    );
                    setData(updatedData);
                }

                if (exist) {
                    createFolder();
                } else {
                    addToFolder();
                }
            } else toast.error(res.message);
            loader(false);
        });
    };
    const getFolders = () => {
        ApiClient.get("folder/list").then((res) => {
            loader(true);
            if (res.success) {
                const foldersData = res?.data?.map((itm) => ({
                    id: itm?._id || itm?.id,
                    name: itm?.name,
                }));
                setFolders(foldersData);
            }
            loader(false);
        });
    };

    useEffect(() => {
        if (user.loggedIn) getFolders();
    }, []);

    const addToFolder = () => {
        let dto = {
            id: form.id,
            name: selectedProp?.name,
            property_id: [flwItem?._id || flwItem?.id],
        };
        ApiClient.put("folder/edit", dto).then((res) => {
            if (res.success) {
                toast.success(res.message);
                reset();
                // if(refetch)refetch();
            }
        });
    };
    const createFolder = () => {
        let dto = { name: name, property_id: [flwItem?._id || flwItem?.id] };
        ApiClient.post("folder/add", dto).then((res) => {
            if (res.success) {
                toast.success(res.message);
                reset();
            }
        });
    };
    const reset = () => {
        setflwModal(false);
        setExist(false);
        setName("");
        setForm({
            id: "",
        });
    };

    return (
        <>
            <Dialog
                open={flwModal}
                onClose={() => reset()}
                className="relative z-[9999]"
            >
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 flex w-screen items-center justify-center">
                    <DialogPanel className="max-w-md w-full bg-white rounded-[20px] mx-5">
                        <DialogTitle className="p-6">
                            <p className="border-b  text-[#389D93] text-[18px] text-center pb-4">
                                Want to follow this Property?
                            </p>
                            <div className="flex justify-center h-[200px] flex-col">
                                <div className="flex  items-center mt-3">
                                    <div className="flex items-center border border-[#dcdcdc] p-2 rounded-[8px] w-1/2 cursor-pointer" onClick={() => setExist(!exist)}>
                                        <Checkbox

                                            checked={!exist}
                                            className="group flex items-center justify-center size-6 rounded-full border bg-white border-[#73339B] data-[checked]:bg-[#73339B]"
                                        >
                                            <svg
                                                className="stroke-white opacity-0 group-data-[checked]:opacity-100  w-[16px] h-[16px]"
                                                viewBox="0 0 14 14"
                                                fill="none"
                                            >
                                                <path
                                                    d="M3 8L6 11L11 3.5"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </Checkbox>
                                        <p className="text-[#47525E] ms-2 text-[15px] mr-4">
                                            Existing Folder
                                        </p>
                                    </div>
                                    <div className="flex items-center border border-[#dcdcdc] p-2 rounded-[8px] w-1/2 ms-3 cursor-pointer" onClick={() => setExist(!exist)}>
                                        <Checkbox

                                            checked={exist}
                                            className="flex items-center justify-center group  size-6 rounded-full border bg-white border-[#73339B] data-[checked]:bg-[#73339B] "
                                        >
                                            <svg
                                                className="stroke-white opacity-0 group-data-[checked]:opacity-100 w-[16px] h-[16px]"
                                                viewBox="0 0 14 14"
                                                fill="none"
                                            >
                                                <path
                                                    d="M3 8L6 11L11 3.5"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </Checkbox>
                                        <p className="text-[#47525E] ms-2 text-[15px] mr-4">
                                            Create New Folder
                                        </p>
                                    </div>
                                </div>

                                {exist ? (
                                    <div>
                                        <label className="  py-3 px-4  text-black text-center text-[20px] w-full flex items-center justify-center">
                                            Select Folder
                                        </label>
                                        <input
                                            value={name}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                if (
                                                    newValue.length <= 200 ||
                                                    newValue.length < name.length
                                                ) {
                                                    setName(newValue);
                                                }
                                            }}
                                            type="text"
                                            className="bg-[#efefef] px-4 py-4  text-[#47525E] text-[14px] w-full"
                                            placeholder="Enter Folder Name"
                                        />
                                        <span className="text-end text-[12px] mt-1 text-[#c10707] ml-auto h-[20px]">
                                            Maximum {name.length}/200 words
                                        </span>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="  py-3 px-4  text-black text-center text-[20px] w-full flex items-center justify-center">
                                            Enter Folder Name
                                        </label>
                                        <SelectDropdown
                                            placeholder="Select Folder"
                                            displayValue="name"
                                            className="mt-2 capitalize"
                                            intialValue={form.id}
                                            theme="search"
                                            result={(e) => {
                                                setForm({ ...form, id: e.value });
                                            }}
                                            options={folders}
                                            isClearable={false}
                                            required
                                        />
                                        <span className="text-end text-[12px] mt-1 text-[#c10707] ml-auto h-[20px] w-full block">

                                        </span>
                                    </div>
                                )}

                            </div>
                        </DialogTitle>
                        <div className="flex border-t p-4 justify-between">
                            <button className="text-[#868389] text-[18px] underline"
                                onClick={() => reset()}>Cancel</button>
                            <button className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                                onClick={() => isFollow()}>Save</button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
};

export default FlwModal;
