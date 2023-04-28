export type NumberInputCounterProps = {
    onDecrement(): void
    onIncrement(): void
    onChange(event: React.ChangeEvent<HTMLInputElement>): void
    value: number
}

const NumberInputCounter: React.FC<NumberInputCounterProps> = ({
    onDecrement,
    onIncrement,
    onChange,
    value,
}) => {
    return (
        <div className="custom-number-input h-10 w-32 flex flex-row items-center">
            <div className="flex flex-row items-center h-10 w-full rounded-lg relative bg-transparent mt-1">
                <button
                    type="button"
                    data-action="decrement"
                    onClick={onDecrement}
                    className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"
                >
                    <span className="m-auto text-2xl font-thin">−</span>
                </button>
                <input
                    type="number"
                    className="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700"
                    name="custom-input-number"
                    value={value}
                    onChange={onChange}
                ></input>
                <button
                    type="button"
                    data-action="increment"
                    onClick={onIncrement}
                    className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
                >
                    <span className="m-auto text-2xl font-thin">+</span>
                </button>
            </div>
        </div>
    )
}

export default NumberInputCounter
