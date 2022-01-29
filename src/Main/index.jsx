import React, { useState, useEffect } from 'react'
import styles from './main.module.scss'
import Weather from '../Components/Weather'
import { useLongPress } from 'use-long-press';

const icons = ["/icons/default.png", "/icons/fan.png", "/icons/fan2.png", "/icons/light.png", "/icons/phone.png", "/icons/tv.png"]

const PowerBtn = ({ setSwitchData,switchData, socket }) => {
    const [on, setOn] = useState(switchData[socket].status);
    let styleBtn = (on) ? (styles.power + " " + styles.on) : (styles.power);
    useEffect(() => {
        setSwitchData((data) => { data[socket].status = on; return {...data} });
        setTimeout(() => {
            localStorage.setItem("state", JSON.stringify(switchData));
        }, 100);
    }, [on])
    return (
        <div className={styleBtn} onClick={() => { setOn(!on) }}>
            <span >
            </span>
        </div>
    )
}

const EditPopUp = ({ setPopVisible, popVisible, switchData, setSwitchData }) => {

    const [form, setForm] = useState({ label: "", icon: "" })

    useEffect(() => {
        setForm({ label: switchData[popVisible.socket].label, icon: switchData[popVisible.socket].icon });
    }, [])

    return (
        <div className={styles.editPopUp}>
            <span>
                <button
                    className={styles.closeBtn}
                    onClick={() => { setPopVisible({ visisble: false, socket: null }) }}>
                    ❌
                </button>
                <p>Select Icon for socket {popVisible.socket}</p>
                <div className={styles.iconSelector}>
                    {
                        icons.map((ic) => {
                            return <img src={ic} alt="" 
                                className={(form.icon == ic) ? styles.imgSelected : null}
                                onClick={() => {
                                    setForm((f) => { f.icon = ic; return { ...f } })
                                }} />
                        })
                    }
                </div>
                <p>Edit Label</p>
                <input value={form.label} type="text"
                    onChange={(e) => { setForm((form) => { form.label = e.target.value; return { ...form } }) }}
                />
                <nav>
                    <button className={styles.timer}>Set Timer</button>
                    <button className={styles.save}
                        onClick={() => {
                            setSwitchData((data) => {
                                data[popVisible.socket].label = form.label;
                                data[popVisible.socket].icon = form.icon;
                                data[popVisible.socket].inUse = true;
                                return { ...data };
                            })
                            setPopVisible({ visisble: false })
                            setTimeout(() => {
                                localStorage.setItem("state", JSON.stringify(switchData));
                            }, 100);

                        }}
                    >Save</button>
                </nav>
            </span>
        </div>
    )
}



function Index() {

    const bind = useLongPress(() => {
        setPopVisible((s) => { s.visisble = true; return { ...s } });
    });

    const [popVisible, setPopVisible] = useState({ visisble: false, socket: "s1" });

    console.log(bind);

    const [switchData, setSwitchData] = useState(
        {
            's1': { status: "", onTime: "", label: "", inUse: false, icon: "/icons/fan.png" },
            's2': { status: "", onTime: "", label: "", inUse: false, icon: "/icons/light.png" },
            's3': { status: "", onTime: "", label: "", inUse: false, icon: "/icons/phone.png" },
            's4': { status: "", onTime: "", label: "", inUse: false, icon: "/icons/tv.png" }
        }
    )

    useEffect(() => {
        let oldState = localStorage.getItem('state');
        if(oldState){
            console.log(JSON.parse(oldState));
            setSwitchData({ ...JSON.parse(oldState) })
        }
    }, [])

    return (
        <div className={styles.con}>
            {(popVisible.visisble) && <EditPopUp setPopVisible={setPopVisible} popVisible={popVisible} switchData={switchData} setSwitchData={setSwitchData} />}
            <Weather />
            <div className={styles.console}>
                {
                    Object.keys(switchData).map((key) => {

                        if (switchData[key].inUse == false) {
                            return (
                                <span className={styles.switch}
                                    onClick={() => { setPopVisible({ socket: key, visisble: true }) }}
                                >
                                    <span className={styles.add}>
                                        <h1>+</h1>
                                    </span>
                                </span>
                            )
                        }

                        return (
                            <span className={styles.switch} {...bind} onMouseOver={() => { setPopVisible((s) => { s.socket = key; return { ...s } }) }}
                             onTouchStartCapture={() => { setPopVisible((s) => { s.socket = key; return { ...s } }) }}
                            >
                                <span>
                                    <img src={switchData[key].icon} alt="" />
                                </span>
                                <h2>{switchData[key].label}</h2>
                                <p>duration: 5 mins</p>
                                <PowerBtn socket={key} setSwitchData={setSwitchData} switchData={switchData} />
                            </span>
                        )
                    })
                }
                {/* <span className={styles.switch} {...bind} onMouseOver={() => { setPopVisible((s) => { s.socket = "s1"; return { ...s } }) }}>
                    <span>
                        <img src="/icons/fan.png" alt="" />
                    </span>
                    <h2>Fan</h2>
                    <p>duration: 5 mins</p>
                    <PowerBtn />
                </span>
                <span className={styles.switch} {...bind} onMouseOver={() => { setPopVisible((s) => { s.socket = "s2"; return { ...s } }) }}>
                    <span>
                        <img src={"/icons/light.png"} alt="" />
                    </span>
                    <h2>Light</h2>
                    <p>duration: 5 mins</p>
                    <PowerBtn />
                </span>
                <span className={styles.switch} {...bind} onMouseOver={() => { setPopVisible((s) => { s.socket = "s3"; return { ...s } }) }}>
                    <span>
                        <img src="/icons/phone.png" alt="" />
                    </span>
                    <h2>Phone</h2>
                    <p>duration: 5 mins</p>
                    <PowerBtn />
                </span>
                <span className={styles.switch} {...bind} onMouseOver={() => { setPopVisible((s) => { s.socket = "s4"; return { ...s } }) }}>
                    <span>
                        <img src="/icons/tv.png" alt="" />
                    </span>
                    <h2>Tv</h2>
                    <p>duration: 5 mins</p>
                    <PowerBtn />
                </span> */}
            </div>
        </div>
    )
}

export default Index
