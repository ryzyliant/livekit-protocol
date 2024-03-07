// gen/version.js
var version = "13.0.0";

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/private/assert.js
function assert(condition, msg) {
  if (!condition) {
    throw new Error(msg);
  }
}
var FLOAT32_MAX = 34028234663852886e22;
var FLOAT32_MIN = -34028234663852886e22;
var UINT32_MAX = 4294967295;
var INT32_MAX = 2147483647;
var INT32_MIN = -2147483648;
function assertInt32(arg) {
  if (typeof arg !== "number")
    throw new Error("invalid int 32: " + typeof arg);
  if (!Number.isInteger(arg) || arg > INT32_MAX || arg < INT32_MIN)
    throw new Error("invalid int 32: " + arg);
}
function assertUInt32(arg) {
  if (typeof arg !== "number")
    throw new Error("invalid uint 32: " + typeof arg);
  if (!Number.isInteger(arg) || arg > UINT32_MAX || arg < 0)
    throw new Error("invalid uint 32: " + arg);
}
function assertFloat32(arg) {
  if (typeof arg !== "number")
    throw new Error("invalid float 32: " + typeof arg);
  if (!Number.isFinite(arg))
    return;
  if (arg > FLOAT32_MAX || arg < FLOAT32_MIN)
    throw new Error("invalid float 32: " + arg);
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/private/enum.js
var enumTypeSymbol = Symbol("@bufbuild/protobuf/enum-type");
function getEnumType(enumObject) {
  const t = enumObject[enumTypeSymbol];
  assert(t, "missing enum type on enum object");
  return t;
}
function setEnumType(enumObject, typeName, values, opt) {
  enumObject[enumTypeSymbol] = makeEnumType(typeName, values.map((v) => ({
    no: v.no,
    name: v.name,
    localName: enumObject[v.no]
  })), opt);
}
function makeEnumType(typeName, values, _opt) {
  const names = /* @__PURE__ */ Object.create(null);
  const numbers = /* @__PURE__ */ Object.create(null);
  const normalValues = [];
  for (const value of values) {
    const n = normalizeEnumValue(value);
    normalValues.push(n);
    names[value.name] = n;
    numbers[value.no] = n;
  }
  return {
    typeName,
    values: normalValues,
    // We do not surface options at this time
    // options: opt?.options ?? Object.create(null),
    findName(name) {
      return names[name];
    },
    findNumber(no) {
      return numbers[no];
    }
  };
}
function makeEnum(typeName, values, opt) {
  const enumObject = {};
  for (const value of values) {
    const n = normalizeEnumValue(value);
    enumObject[n.localName] = n.no;
    enumObject[n.no] = n.localName;
  }
  setEnumType(enumObject, typeName, values, opt);
  return enumObject;
}
function normalizeEnumValue(value) {
  if ("localName" in value) {
    return value;
  }
  return Object.assign(Object.assign({}, value), { localName: value.name });
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/message.js
var Message = class {
  /**
   * Compare with a message of the same type.
   */
  equals(other) {
    return this.getType().runtime.util.equals(this.getType(), this, other);
  }
  /**
   * Create a deep copy.
   */
  clone() {
    return this.getType().runtime.util.clone(this);
  }
  /**
   * Parse from binary data, merging fields.
   *
   * Repeated fields are appended. Map entries are added, overwriting
   * existing keys.
   *
   * If a message field is already present, it will be merged with the
   * new data.
   */
  fromBinary(bytes, options) {
    const type = this.getType(), format = type.runtime.bin, opt = format.makeReadOptions(options);
    format.readMessage(this, opt.readerFactory(bytes), bytes.byteLength, opt);
    return this;
  }
  /**
   * Parse a message from a JSON value.
   */
  fromJson(jsonValue, options) {
    const type = this.getType(), format = type.runtime.json, opt = format.makeReadOptions(options);
    format.readMessage(type, jsonValue, opt, this);
    return this;
  }
  /**
   * Parse a message from a JSON string.
   */
  fromJsonString(jsonString, options) {
    let json;
    try {
      json = JSON.parse(jsonString);
    } catch (e) {
      throw new Error(`cannot decode ${this.getType().typeName} from JSON: ${e instanceof Error ? e.message : String(e)}`);
    }
    return this.fromJson(json, options);
  }
  /**
   * Serialize the message to binary data.
   */
  toBinary(options) {
    const type = this.getType(), bin = type.runtime.bin, opt = bin.makeWriteOptions(options), writer = opt.writerFactory();
    bin.writeMessage(this, writer, opt);
    return writer.finish();
  }
  /**
   * Serialize the message to a JSON value, a JavaScript value that can be
   * passed to JSON.stringify().
   */
  toJson(options) {
    const type = this.getType(), json = type.runtime.json, opt = json.makeWriteOptions(options);
    return json.writeMessage(this, opt);
  }
  /**
   * Serialize the message to a JSON string.
   */
  toJsonString(options) {
    var _a;
    const value = this.toJson(options);
    return JSON.stringify(value, null, (_a = options === null || options === void 0 ? void 0 : options.prettySpaces) !== null && _a !== void 0 ? _a : 0);
  }
  /**
   * Override for serialization behavior. This will be invoked when calling
   * JSON.stringify on this message (i.e. JSON.stringify(msg)).
   *
   * Note that this will not serialize google.protobuf.Any with a packed
   * message because the protobuf JSON format specifies that it needs to be
   * unpacked, and this is only possible with a type registry to look up the
   * message type.  As a result, attempting to serialize a message with this
   * type will throw an Error.
   *
   * This method is protected because you should not need to invoke it
   * directly -- instead use JSON.stringify or toJsonString for
   * stringified JSON.  Alternatively, if actual JSON is desired, you should
   * use toJson.
   */
  toJSON() {
    return this.toJson({
      emitDefaultValues: true
    });
  }
  /**
   * Retrieve the MessageType of this message - a singleton that represents
   * the protobuf message declaration and provides metadata for reflection-
   * based operations.
   */
  getType() {
    return Object.getPrototypeOf(this).constructor;
  }
};

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/private/message-type.js
function makeMessageType(runtime, typeName, fields, opt) {
  var _a;
  const localName = (_a = opt === null || opt === void 0 ? void 0 : opt.localName) !== null && _a !== void 0 ? _a : typeName.substring(typeName.lastIndexOf(".") + 1);
  const type = {
    [localName]: function(data) {
      runtime.util.initFields(this);
      runtime.util.initPartial(data, this);
    }
  }[localName];
  Object.setPrototypeOf(type.prototype, new Message());
  Object.assign(type, {
    runtime,
    typeName,
    fields: runtime.util.newFieldList(fields),
    fromBinary(bytes, options) {
      return new type().fromBinary(bytes, options);
    },
    fromJson(jsonValue, options) {
      return new type().fromJson(jsonValue, options);
    },
    fromJsonString(jsonString, options) {
      return new type().fromJsonString(jsonString, options);
    },
    equals(a, b) {
      return runtime.util.equals(type, a, b);
    }
  });
  return type;
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/field.js
var ScalarType;
(function(ScalarType2) {
  ScalarType2[ScalarType2["DOUBLE"] = 1] = "DOUBLE";
  ScalarType2[ScalarType2["FLOAT"] = 2] = "FLOAT";
  ScalarType2[ScalarType2["INT64"] = 3] = "INT64";
  ScalarType2[ScalarType2["UINT64"] = 4] = "UINT64";
  ScalarType2[ScalarType2["INT32"] = 5] = "INT32";
  ScalarType2[ScalarType2["FIXED64"] = 6] = "FIXED64";
  ScalarType2[ScalarType2["FIXED32"] = 7] = "FIXED32";
  ScalarType2[ScalarType2["BOOL"] = 8] = "BOOL";
  ScalarType2[ScalarType2["STRING"] = 9] = "STRING";
  ScalarType2[ScalarType2["BYTES"] = 12] = "BYTES";
  ScalarType2[ScalarType2["UINT32"] = 13] = "UINT32";
  ScalarType2[ScalarType2["SFIXED32"] = 15] = "SFIXED32";
  ScalarType2[ScalarType2["SFIXED64"] = 16] = "SFIXED64";
  ScalarType2[ScalarType2["SINT32"] = 17] = "SINT32";
  ScalarType2[ScalarType2["SINT64"] = 18] = "SINT64";
})(ScalarType || (ScalarType = {}));
var LongType;
(function(LongType2) {
  LongType2[LongType2["BIGINT"] = 0] = "BIGINT";
  LongType2[LongType2["STRING"] = 1] = "STRING";
})(LongType || (LongType = {}));

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/google/varint.js
function varint64read() {
  let lowBits = 0;
  let highBits = 0;
  for (let shift = 0; shift < 28; shift += 7) {
    let b = this.buf[this.pos++];
    lowBits |= (b & 127) << shift;
    if ((b & 128) == 0) {
      this.assertBounds();
      return [lowBits, highBits];
    }
  }
  let middleByte = this.buf[this.pos++];
  lowBits |= (middleByte & 15) << 28;
  highBits = (middleByte & 112) >> 4;
  if ((middleByte & 128) == 0) {
    this.assertBounds();
    return [lowBits, highBits];
  }
  for (let shift = 3; shift <= 31; shift += 7) {
    let b = this.buf[this.pos++];
    highBits |= (b & 127) << shift;
    if ((b & 128) == 0) {
      this.assertBounds();
      return [lowBits, highBits];
    }
  }
  throw new Error("invalid varint");
}
function varint64write(lo, hi, bytes) {
  for (let i = 0; i < 28; i = i + 7) {
    const shift = lo >>> i;
    const hasNext = !(shift >>> 7 == 0 && hi == 0);
    const byte = (hasNext ? shift | 128 : shift) & 255;
    bytes.push(byte);
    if (!hasNext) {
      return;
    }
  }
  const splitBits = lo >>> 28 & 15 | (hi & 7) << 4;
  const hasMoreBits = !(hi >> 3 == 0);
  bytes.push((hasMoreBits ? splitBits | 128 : splitBits) & 255);
  if (!hasMoreBits) {
    return;
  }
  for (let i = 3; i < 31; i = i + 7) {
    const shift = hi >>> i;
    const hasNext = !(shift >>> 7 == 0);
    const byte = (hasNext ? shift | 128 : shift) & 255;
    bytes.push(byte);
    if (!hasNext) {
      return;
    }
  }
  bytes.push(hi >>> 31 & 1);
}
var TWO_PWR_32_DBL = 4294967296;
function int64FromString(dec) {
  const minus = dec[0] === "-";
  if (minus) {
    dec = dec.slice(1);
  }
  const base = 1e6;
  let lowBits = 0;
  let highBits = 0;
  function add1e6digit(begin, end) {
    const digit1e6 = Number(dec.slice(begin, end));
    highBits *= base;
    lowBits = lowBits * base + digit1e6;
    if (lowBits >= TWO_PWR_32_DBL) {
      highBits = highBits + (lowBits / TWO_PWR_32_DBL | 0);
      lowBits = lowBits % TWO_PWR_32_DBL;
    }
  }
  add1e6digit(-24, -18);
  add1e6digit(-18, -12);
  add1e6digit(-12, -6);
  add1e6digit(-6);
  return minus ? negate(lowBits, highBits) : newBits(lowBits, highBits);
}
function int64ToString(lo, hi) {
  let bits = newBits(lo, hi);
  const negative = bits.hi & 2147483648;
  if (negative) {
    bits = negate(bits.lo, bits.hi);
  }
  const result = uInt64ToString(bits.lo, bits.hi);
  return negative ? "-" + result : result;
}
function uInt64ToString(lo, hi) {
  ({ lo, hi } = toUnsigned(lo, hi));
  if (hi <= 2097151) {
    return String(TWO_PWR_32_DBL * hi + lo);
  }
  const low = lo & 16777215;
  const mid = (lo >>> 24 | hi << 8) & 16777215;
  const high = hi >> 16 & 65535;
  let digitA = low + mid * 6777216 + high * 6710656;
  let digitB = mid + high * 8147497;
  let digitC = high * 2;
  const base = 1e7;
  if (digitA >= base) {
    digitB += Math.floor(digitA / base);
    digitA %= base;
  }
  if (digitB >= base) {
    digitC += Math.floor(digitB / base);
    digitB %= base;
  }
  return digitC.toString() + decimalFrom1e7WithLeadingZeros(digitB) + decimalFrom1e7WithLeadingZeros(digitA);
}
function toUnsigned(lo, hi) {
  return { lo: lo >>> 0, hi: hi >>> 0 };
}
function newBits(lo, hi) {
  return { lo: lo | 0, hi: hi | 0 };
}
function negate(lowBits, highBits) {
  highBits = ~highBits;
  if (lowBits) {
    lowBits = ~lowBits + 1;
  } else {
    highBits += 1;
  }
  return newBits(lowBits, highBits);
}
var decimalFrom1e7WithLeadingZeros = (digit1e7) => {
  const partial = String(digit1e7);
  return "0000000".slice(partial.length) + partial;
};
function varint32write(value, bytes) {
  if (value >= 0) {
    while (value > 127) {
      bytes.push(value & 127 | 128);
      value = value >>> 7;
    }
    bytes.push(value);
  } else {
    for (let i = 0; i < 9; i++) {
      bytes.push(value & 127 | 128);
      value = value >> 7;
    }
    bytes.push(1);
  }
}
function varint32read() {
  let b = this.buf[this.pos++];
  let result = b & 127;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 127) << 7;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 127) << 14;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 127) << 21;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 15) << 28;
  for (let readBytes = 5; (b & 128) !== 0 && readBytes < 10; readBytes++)
    b = this.buf[this.pos++];
  if ((b & 128) != 0)
    throw new Error("invalid varint");
  this.assertBounds();
  return result >>> 0;
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/proto-int64.js
function makeInt64Support() {
  const dv = new DataView(new ArrayBuffer(8));
  const ok = typeof BigInt === "function" && typeof dv.getBigInt64 === "function" && typeof dv.getBigUint64 === "function" && typeof dv.setBigInt64 === "function" && typeof dv.setBigUint64 === "function" && (typeof process != "object" || typeof process.env != "object" || process.env.BUF_BIGINT_DISABLE !== "1");
  if (ok) {
    const MIN = BigInt("-9223372036854775808"), MAX = BigInt("9223372036854775807"), UMIN = BigInt("0"), UMAX = BigInt("18446744073709551615");
    return {
      zero: BigInt(0),
      supported: true,
      parse(value) {
        const bi = typeof value == "bigint" ? value : BigInt(value);
        if (bi > MAX || bi < MIN) {
          throw new Error(`int64 invalid: ${value}`);
        }
        return bi;
      },
      uParse(value) {
        const bi = typeof value == "bigint" ? value : BigInt(value);
        if (bi > UMAX || bi < UMIN) {
          throw new Error(`uint64 invalid: ${value}`);
        }
        return bi;
      },
      enc(value) {
        dv.setBigInt64(0, this.parse(value), true);
        return {
          lo: dv.getInt32(0, true),
          hi: dv.getInt32(4, true)
        };
      },
      uEnc(value) {
        dv.setBigInt64(0, this.uParse(value), true);
        return {
          lo: dv.getInt32(0, true),
          hi: dv.getInt32(4, true)
        };
      },
      dec(lo, hi) {
        dv.setInt32(0, lo, true);
        dv.setInt32(4, hi, true);
        return dv.getBigInt64(0, true);
      },
      uDec(lo, hi) {
        dv.setInt32(0, lo, true);
        dv.setInt32(4, hi, true);
        return dv.getBigUint64(0, true);
      }
    };
  }
  const assertInt64String = (value) => assert(/^-?[0-9]+$/.test(value), `int64 invalid: ${value}`);
  const assertUInt64String = (value) => assert(/^[0-9]+$/.test(value), `uint64 invalid: ${value}`);
  return {
    zero: "0",
    supported: false,
    parse(value) {
      if (typeof value != "string") {
        value = value.toString();
      }
      assertInt64String(value);
      return value;
    },
    uParse(value) {
      if (typeof value != "string") {
        value = value.toString();
      }
      assertUInt64String(value);
      return value;
    },
    enc(value) {
      if (typeof value != "string") {
        value = value.toString();
      }
      assertInt64String(value);
      return int64FromString(value);
    },
    uEnc(value) {
      if (typeof value != "string") {
        value = value.toString();
      }
      assertUInt64String(value);
      return int64FromString(value);
    },
    dec(lo, hi) {
      return int64ToString(lo, hi);
    },
    uDec(lo, hi) {
      return uInt64ToString(lo, hi);
    }
  };
}
var protoInt64 = makeInt64Support();

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/binary-encoding.js
var WireType;
(function(WireType2) {
  WireType2[WireType2["Varint"] = 0] = "Varint";
  WireType2[WireType2["Bit64"] = 1] = "Bit64";
  WireType2[WireType2["LengthDelimited"] = 2] = "LengthDelimited";
  WireType2[WireType2["StartGroup"] = 3] = "StartGroup";
  WireType2[WireType2["EndGroup"] = 4] = "EndGroup";
  WireType2[WireType2["Bit32"] = 5] = "Bit32";
})(WireType || (WireType = {}));
var BinaryWriter = class {
  constructor(textEncoder) {
    this.stack = [];
    this.textEncoder = textEncoder !== null && textEncoder !== void 0 ? textEncoder : new TextEncoder();
    this.chunks = [];
    this.buf = [];
  }
  /**
   * Return all bytes written and reset this writer.
   */
  finish() {
    this.chunks.push(new Uint8Array(this.buf));
    let len = 0;
    for (let i = 0; i < this.chunks.length; i++)
      len += this.chunks[i].length;
    let bytes = new Uint8Array(len);
    let offset = 0;
    for (let i = 0; i < this.chunks.length; i++) {
      bytes.set(this.chunks[i], offset);
      offset += this.chunks[i].length;
    }
    this.chunks = [];
    return bytes;
  }
  /**
   * Start a new fork for length-delimited data like a message
   * or a packed repeated field.
   *
   * Must be joined later with `join()`.
   */
  fork() {
    this.stack.push({ chunks: this.chunks, buf: this.buf });
    this.chunks = [];
    this.buf = [];
    return this;
  }
  /**
   * Join the last fork. Write its length and bytes, then
   * return to the previous state.
   */
  join() {
    let chunk = this.finish();
    let prev = this.stack.pop();
    if (!prev)
      throw new Error("invalid state, fork stack empty");
    this.chunks = prev.chunks;
    this.buf = prev.buf;
    this.uint32(chunk.byteLength);
    return this.raw(chunk);
  }
  /**
   * Writes a tag (field number and wire type).
   *
   * Equivalent to `uint32( (fieldNo << 3 | type) >>> 0 )`.
   *
   * Generated code should compute the tag ahead of time and call `uint32()`.
   */
  tag(fieldNo, type) {
    return this.uint32((fieldNo << 3 | type) >>> 0);
  }
  /**
   * Write a chunk of raw bytes.
   */
  raw(chunk) {
    if (this.buf.length) {
      this.chunks.push(new Uint8Array(this.buf));
      this.buf = [];
    }
    this.chunks.push(chunk);
    return this;
  }
  /**
   * Write a `uint32` value, an unsigned 32 bit varint.
   */
  uint32(value) {
    assertUInt32(value);
    while (value > 127) {
      this.buf.push(value & 127 | 128);
      value = value >>> 7;
    }
    this.buf.push(value);
    return this;
  }
  /**
   * Write a `int32` value, a signed 32 bit varint.
   */
  int32(value) {
    assertInt32(value);
    varint32write(value, this.buf);
    return this;
  }
  /**
   * Write a `bool` value, a variant.
   */
  bool(value) {
    this.buf.push(value ? 1 : 0);
    return this;
  }
  /**
   * Write a `bytes` value, length-delimited arbitrary data.
   */
  bytes(value) {
    this.uint32(value.byteLength);
    return this.raw(value);
  }
  /**
   * Write a `string` value, length-delimited data converted to UTF-8 text.
   */
  string(value) {
    let chunk = this.textEncoder.encode(value);
    this.uint32(chunk.byteLength);
    return this.raw(chunk);
  }
  /**
   * Write a `float` value, 32-bit floating point number.
   */
  float(value) {
    assertFloat32(value);
    let chunk = new Uint8Array(4);
    new DataView(chunk.buffer).setFloat32(0, value, true);
    return this.raw(chunk);
  }
  /**
   * Write a `double` value, a 64-bit floating point number.
   */
  double(value) {
    let chunk = new Uint8Array(8);
    new DataView(chunk.buffer).setFloat64(0, value, true);
    return this.raw(chunk);
  }
  /**
   * Write a `fixed32` value, an unsigned, fixed-length 32-bit integer.
   */
  fixed32(value) {
    assertUInt32(value);
    let chunk = new Uint8Array(4);
    new DataView(chunk.buffer).setUint32(0, value, true);
    return this.raw(chunk);
  }
  /**
   * Write a `sfixed32` value, a signed, fixed-length 32-bit integer.
   */
  sfixed32(value) {
    assertInt32(value);
    let chunk = new Uint8Array(4);
    new DataView(chunk.buffer).setInt32(0, value, true);
    return this.raw(chunk);
  }
  /**
   * Write a `sint32` value, a signed, zigzag-encoded 32-bit varint.
   */
  sint32(value) {
    assertInt32(value);
    value = (value << 1 ^ value >> 31) >>> 0;
    varint32write(value, this.buf);
    return this;
  }
  /**
   * Write a `fixed64` value, a signed, fixed-length 64-bit integer.
   */
  sfixed64(value) {
    let chunk = new Uint8Array(8), view = new DataView(chunk.buffer), tc = protoInt64.enc(value);
    view.setInt32(0, tc.lo, true);
    view.setInt32(4, tc.hi, true);
    return this.raw(chunk);
  }
  /**
   * Write a `fixed64` value, an unsigned, fixed-length 64 bit integer.
   */
  fixed64(value) {
    let chunk = new Uint8Array(8), view = new DataView(chunk.buffer), tc = protoInt64.uEnc(value);
    view.setInt32(0, tc.lo, true);
    view.setInt32(4, tc.hi, true);
    return this.raw(chunk);
  }
  /**
   * Write a `int64` value, a signed 64-bit varint.
   */
  int64(value) {
    let tc = protoInt64.enc(value);
    varint64write(tc.lo, tc.hi, this.buf);
    return this;
  }
  /**
   * Write a `sint64` value, a signed, zig-zag-encoded 64-bit varint.
   */
  sint64(value) {
    let tc = protoInt64.enc(value), sign = tc.hi >> 31, lo = tc.lo << 1 ^ sign, hi = (tc.hi << 1 | tc.lo >>> 31) ^ sign;
    varint64write(lo, hi, this.buf);
    return this;
  }
  /**
   * Write a `uint64` value, an unsigned 64-bit varint.
   */
  uint64(value) {
    let tc = protoInt64.uEnc(value);
    varint64write(tc.lo, tc.hi, this.buf);
    return this;
  }
};
var BinaryReader = class {
  constructor(buf, textDecoder) {
    this.varint64 = varint64read;
    this.uint32 = varint32read;
    this.buf = buf;
    this.len = buf.length;
    this.pos = 0;
    this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    this.textDecoder = textDecoder !== null && textDecoder !== void 0 ? textDecoder : new TextDecoder();
  }
  /**
   * Reads a tag - field number and wire type.
   */
  tag() {
    let tag = this.uint32(), fieldNo = tag >>> 3, wireType = tag & 7;
    if (fieldNo <= 0 || wireType < 0 || wireType > 5)
      throw new Error("illegal tag: field no " + fieldNo + " wire type " + wireType);
    return [fieldNo, wireType];
  }
  /**
   * Skip one element on the wire and return the skipped data.
   * Supports WireType.StartGroup since v2.0.0-alpha.23.
   */
  skip(wireType) {
    let start = this.pos;
    switch (wireType) {
      case WireType.Varint:
        while (this.buf[this.pos++] & 128) {
        }
        break;
      case WireType.Bit64:
        this.pos += 4;
      case WireType.Bit32:
        this.pos += 4;
        break;
      case WireType.LengthDelimited:
        let len = this.uint32();
        this.pos += len;
        break;
      case WireType.StartGroup:
        let t;
        while ((t = this.tag()[1]) !== WireType.EndGroup) {
          this.skip(t);
        }
        break;
      default:
        throw new Error("cant skip wire type " + wireType);
    }
    this.assertBounds();
    return this.buf.subarray(start, this.pos);
  }
  /**
   * Throws error if position in byte array is out of range.
   */
  assertBounds() {
    if (this.pos > this.len)
      throw new RangeError("premature EOF");
  }
  /**
   * Read a `int32` field, a signed 32 bit varint.
   */
  int32() {
    return this.uint32() | 0;
  }
  /**
   * Read a `sint32` field, a signed, zigzag-encoded 32-bit varint.
   */
  sint32() {
    let zze = this.uint32();
    return zze >>> 1 ^ -(zze & 1);
  }
  /**
   * Read a `int64` field, a signed 64-bit varint.
   */
  int64() {
    return protoInt64.dec(...this.varint64());
  }
  /**
   * Read a `uint64` field, an unsigned 64-bit varint.
   */
  uint64() {
    return protoInt64.uDec(...this.varint64());
  }
  /**
   * Read a `sint64` field, a signed, zig-zag-encoded 64-bit varint.
   */
  sint64() {
    let [lo, hi] = this.varint64();
    let s = -(lo & 1);
    lo = (lo >>> 1 | (hi & 1) << 31) ^ s;
    hi = hi >>> 1 ^ s;
    return protoInt64.dec(lo, hi);
  }
  /**
   * Read a `bool` field, a variant.
   */
  bool() {
    let [lo, hi] = this.varint64();
    return lo !== 0 || hi !== 0;
  }
  /**
   * Read a `fixed32` field, an unsigned, fixed-length 32-bit integer.
   */
  fixed32() {
    return this.view.getUint32((this.pos += 4) - 4, true);
  }
  /**
   * Read a `sfixed32` field, a signed, fixed-length 32-bit integer.
   */
  sfixed32() {
    return this.view.getInt32((this.pos += 4) - 4, true);
  }
  /**
   * Read a `fixed64` field, an unsigned, fixed-length 64 bit integer.
   */
  fixed64() {
    return protoInt64.uDec(this.sfixed32(), this.sfixed32());
  }
  /**
   * Read a `fixed64` field, a signed, fixed-length 64-bit integer.
   */
  sfixed64() {
    return protoInt64.dec(this.sfixed32(), this.sfixed32());
  }
  /**
   * Read a `float` field, 32-bit floating point number.
   */
  float() {
    return this.view.getFloat32((this.pos += 4) - 4, true);
  }
  /**
   * Read a `double` field, a 64-bit floating point number.
   */
  double() {
    return this.view.getFloat64((this.pos += 8) - 8, true);
  }
  /**
   * Read a `bytes` field, length-delimited arbitrary data.
   */
  bytes() {
    let len = this.uint32(), start = this.pos;
    this.pos += len;
    this.assertBounds();
    return this.buf.subarray(start, start + len);
  }
  /**
   * Read a `string` field, length-delimited data converted to UTF-8 text.
   */
  string() {
    return this.textDecoder.decode(this.bytes());
  }
};

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/private/scalars.js
function scalarEquals(type, a, b) {
  if (a === b) {
    return true;
  }
  if (type == ScalarType.BYTES) {
    if (!(a instanceof Uint8Array) || !(b instanceof Uint8Array)) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
  switch (type) {
    case ScalarType.UINT64:
    case ScalarType.FIXED64:
    case ScalarType.INT64:
    case ScalarType.SFIXED64:
    case ScalarType.SINT64:
      return a == b;
  }
  return false;
}
function scalarDefaultValue(type, longType) {
  switch (type) {
    case ScalarType.BOOL:
      return false;
    case ScalarType.UINT64:
    case ScalarType.FIXED64:
    case ScalarType.INT64:
    case ScalarType.SFIXED64:
    case ScalarType.SINT64:
      return longType == 0 ? protoInt64.zero : "0";
    case ScalarType.DOUBLE:
    case ScalarType.FLOAT:
      return 0;
    case ScalarType.BYTES:
      return new Uint8Array(0);
    case ScalarType.STRING:
      return "";
    default:
      return 0;
  }
}
function scalarTypeInfo(type, value) {
  const isUndefined = value === void 0;
  let wireType = WireType.Varint;
  let isIntrinsicDefault = value === 0;
  switch (type) {
    case ScalarType.STRING:
      isIntrinsicDefault = isUndefined || !value.length;
      wireType = WireType.LengthDelimited;
      break;
    case ScalarType.BOOL:
      isIntrinsicDefault = value === false;
      break;
    case ScalarType.DOUBLE:
      wireType = WireType.Bit64;
      break;
    case ScalarType.FLOAT:
      wireType = WireType.Bit32;
      break;
    case ScalarType.INT64:
      isIntrinsicDefault = isUndefined || value == 0;
      break;
    case ScalarType.UINT64:
      isIntrinsicDefault = isUndefined || value == 0;
      break;
    case ScalarType.FIXED64:
      isIntrinsicDefault = isUndefined || value == 0;
      wireType = WireType.Bit64;
      break;
    case ScalarType.BYTES:
      isIntrinsicDefault = isUndefined || !value.byteLength;
      wireType = WireType.LengthDelimited;
      break;
    case ScalarType.FIXED32:
      wireType = WireType.Bit32;
      break;
    case ScalarType.SFIXED32:
      wireType = WireType.Bit32;
      break;
    case ScalarType.SFIXED64:
      isIntrinsicDefault = isUndefined || value == 0;
      wireType = WireType.Bit64;
      break;
    case ScalarType.SINT64:
      isIntrinsicDefault = isUndefined || value == 0;
      break;
  }
  const method = ScalarType[type].toLowerCase();
  return [wireType, method, isUndefined || isIntrinsicDefault];
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/private/extensions.js
function makeExtension(runtime, typeName, extendee, field) {
  let fi;
  return {
    typeName,
    extendee,
    get field() {
      if (!fi) {
        const i = typeof field == "function" ? field() : field;
        i.name = typeName.split(".").pop();
        i.jsonName = `[${typeName}]`;
        fi = runtime.util.newFieldList([i]).list()[0];
      }
      return fi;
    },
    runtime
  };
}
function createExtensionContainer(extension) {
  const localName = extension.field.localName;
  const container = /* @__PURE__ */ Object.create(null);
  container[localName] = initExtensionField(extension);
  return [container, () => container[localName]];
}
function initExtensionField(ext) {
  const field = ext.field;
  if (field.repeated) {
    return [];
  }
  if (field.default !== void 0) {
    return field.default;
  }
  switch (field.kind) {
    case "enum":
      return field.T.values[0].no;
    case "scalar":
      return scalarDefaultValue(field.T, field.L);
    case "message":
      const T = field.T, value = new T();
      return T.fieldWrapper ? T.fieldWrapper.unwrapField(value) : value;
    case "map":
      throw "map fields are not allowed to be extensions";
  }
}
function filterUnknownFields(unknownFields, field) {
  if (!field.repeated && (field.kind == "enum" || field.kind == "scalar")) {
    for (let i = unknownFields.length - 1; i >= 0; --i) {
      if (unknownFields[i].no == field.no) {
        return [unknownFields[i]];
      }
    }
    return [];
  }
  return unknownFields.filter((uf) => uf.no === field.no);
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/private/proto-runtime.js
function makeProtoRuntime(syntax, json, bin, util) {
  return {
    syntax,
    json,
    bin,
    util,
    makeMessageType(typeName, fields, opt) {
      return makeMessageType(this, typeName, fields, opt);
    },
    makeEnum,
    makeEnumType,
    getEnumType,
    makeExtension(typeName, extendee, field) {
      return makeExtension(this, typeName, extendee, field);
    }
  };
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/private/field-wrapper.js
function wrapField(type, value) {
  if (value instanceof Message || !type.fieldWrapper) {
    return value;
  }
  return type.fieldWrapper.wrapField(value);
}
var wktWrapperToScalarType = {
  "google.protobuf.DoubleValue": ScalarType.DOUBLE,
  "google.protobuf.FloatValue": ScalarType.FLOAT,
  "google.protobuf.Int64Value": ScalarType.INT64,
  "google.protobuf.UInt64Value": ScalarType.UINT64,
  "google.protobuf.Int32Value": ScalarType.INT32,
  "google.protobuf.UInt32Value": ScalarType.UINT32,
  "google.protobuf.BoolValue": ScalarType.BOOL,
  "google.protobuf.StringValue": ScalarType.STRING,
  "google.protobuf.BytesValue": ScalarType.BYTES
};

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/private/binary-format-common.js
var unknownFieldsSymbol = Symbol("@bufbuild/protobuf/unknown-fields");
var readDefaults = {
  readUnknownFields: true,
  readerFactory: (bytes) => new BinaryReader(bytes)
};
var writeDefaults = {
  writeUnknownFields: true,
  writerFactory: () => new BinaryWriter()
};
function makeReadOptions(options) {
  return options ? Object.assign(Object.assign({}, readDefaults), options) : readDefaults;
}
function makeWriteOptions(options) {
  return options ? Object.assign(Object.assign({}, writeDefaults), options) : writeDefaults;
}
function makeBinaryFormatCommon() {
  return {
    makeReadOptions,
    makeWriteOptions,
    listUnknownFields(message) {
      var _a;
      return (_a = message[unknownFieldsSymbol]) !== null && _a !== void 0 ? _a : [];
    },
    discardUnknownFields(message) {
      delete message[unknownFieldsSymbol];
    },
    writeUnknownFields(message, writer) {
      const m = message;
      const c = m[unknownFieldsSymbol];
      if (c) {
        for (const f of c) {
          writer.tag(f.no, f.wireType).raw(f.data);
        }
      }
    },
    onUnknownField(message, no, wireType, data) {
      const m = message;
      if (!Array.isArray(m[unknownFieldsSymbol])) {
        m[unknownFieldsSymbol] = [];
      }
      m[unknownFieldsSymbol].push({ no, wireType, data });
    },
    readMessage(message, reader, lengthOrEndTagFieldNo, options, delimitedMessageEncoding) {
      const type = message.getType();
      const end = delimitedMessageEncoding ? reader.len : reader.pos + lengthOrEndTagFieldNo;
      let fieldNo, wireType;
      while (reader.pos < end) {
        [fieldNo, wireType] = reader.tag();
        if (wireType == WireType.EndGroup) {
          break;
        }
        const field = type.fields.find(fieldNo);
        if (!field) {
          const data = reader.skip(wireType);
          if (options.readUnknownFields) {
            this.onUnknownField(message, fieldNo, wireType, data);
          }
          continue;
        }
        readField(message, reader, field, wireType, options);
      }
      if (delimitedMessageEncoding && // eslint-disable-line @typescript-eslint/strict-boolean-expressions
      (wireType != WireType.EndGroup || fieldNo !== lengthOrEndTagFieldNo)) {
        throw new Error(`invalid end group tag`);
      }
    },
    readField
  };
}
function readField(target, reader, field, wireType, options) {
  let { repeated, localName } = field;
  if (field.oneof) {
    target = target[field.oneof.localName];
    if (target.case != localName) {
      delete target.value;
    }
    target.case = localName;
    localName = "value";
  }
  switch (field.kind) {
    case "scalar":
    case "enum":
      const scalarType = field.kind == "enum" ? ScalarType.INT32 : field.T;
      let read = readScalar;
      if (field.kind == "scalar" && field.L > 0) {
        read = readScalarLTString;
      }
      if (repeated) {
        let arr = target[localName];
        const isPacked = wireType == WireType.LengthDelimited && scalarType != ScalarType.STRING && scalarType != ScalarType.BYTES;
        if (isPacked) {
          let e = reader.uint32() + reader.pos;
          while (reader.pos < e) {
            arr.push(read(reader, scalarType));
          }
        } else {
          arr.push(read(reader, scalarType));
        }
      } else {
        target[localName] = read(reader, scalarType);
      }
      break;
    case "message":
      const messageType = field.T;
      if (repeated) {
        target[localName].push(readMessageField(reader, new messageType(), options, field));
      } else {
        if (target[localName] instanceof Message) {
          readMessageField(reader, target[localName], options, field);
        } else {
          target[localName] = readMessageField(reader, new messageType(), options, field);
          if (messageType.fieldWrapper && !field.oneof && !field.repeated) {
            target[localName] = messageType.fieldWrapper.unwrapField(target[localName]);
          }
        }
      }
      break;
    case "map":
      let [mapKey, mapVal] = readMapEntry(field, reader, options);
      target[localName][mapKey] = mapVal;
      break;
  }
}
function readMessageField(reader, message, options, field) {
  const format = message.getType().runtime.bin;
  const delimited = field === null || field === void 0 ? void 0 : field.delimited;
  format.readMessage(
    message,
    reader,
    delimited ? field === null || field === void 0 ? void 0 : field.no : reader.uint32(),
    // eslint-disable-line @typescript-eslint/strict-boolean-expressions
    options,
    delimited
  );
  return message;
}
function readMapEntry(field, reader, options) {
  const length = reader.uint32(), end = reader.pos + length;
  let key, val;
  while (reader.pos < end) {
    let [fieldNo] = reader.tag();
    switch (fieldNo) {
      case 1:
        key = readScalar(reader, field.K);
        break;
      case 2:
        switch (field.V.kind) {
          case "scalar":
            val = readScalar(reader, field.V.T);
            break;
          case "enum":
            val = reader.int32();
            break;
          case "message":
            val = readMessageField(reader, new field.V.T(), options, void 0);
            break;
        }
        break;
    }
  }
  if (key === void 0) {
    let keyRaw = scalarDefaultValue(field.K, LongType.BIGINT);
    key = field.K == ScalarType.BOOL ? keyRaw.toString() : keyRaw;
  }
  if (typeof key != "string" && typeof key != "number") {
    key = key.toString();
  }
  if (val === void 0) {
    switch (field.V.kind) {
      case "scalar":
        val = scalarDefaultValue(field.V.T, LongType.BIGINT);
        break;
      case "enum":
        val = 0;
        break;
      case "message":
        val = new field.V.T();
        break;
    }
  }
  return [key, val];
}
function readScalarLTString(reader, type) {
  const v = readScalar(reader, type);
  return typeof v == "bigint" ? v.toString() : v;
}
function readScalar(reader, type) {
  switch (type) {
    case ScalarType.STRING:
      return reader.string();
    case ScalarType.BOOL:
      return reader.bool();
    case ScalarType.DOUBLE:
      return reader.double();
    case ScalarType.FLOAT:
      return reader.float();
    case ScalarType.INT32:
      return reader.int32();
    case ScalarType.INT64:
      return reader.int64();
    case ScalarType.UINT64:
      return reader.uint64();
    case ScalarType.FIXED64:
      return reader.fixed64();
    case ScalarType.BYTES:
      return reader.bytes();
    case ScalarType.FIXED32:
      return reader.fixed32();
    case ScalarType.SFIXED32:
      return reader.sfixed32();
    case ScalarType.SFIXED64:
      return reader.sfixed64();
    case ScalarType.SINT64:
      return reader.sint64();
    case ScalarType.UINT32:
      return reader.uint32();
    case ScalarType.SINT32:
      return reader.sint32();
  }
}
function writeMapEntry(writer, options, field, key, value) {
  writer.tag(field.no, WireType.LengthDelimited);
  writer.fork();
  let keyValue = key;
  switch (field.K) {
    case ScalarType.INT32:
    case ScalarType.FIXED32:
    case ScalarType.UINT32:
    case ScalarType.SFIXED32:
    case ScalarType.SINT32:
      keyValue = Number.parseInt(key);
      break;
    case ScalarType.BOOL:
      assert(key == "true" || key == "false");
      keyValue = key == "true";
      break;
  }
  writeScalar(writer, field.K, 1, keyValue, true);
  switch (field.V.kind) {
    case "scalar":
      writeScalar(writer, field.V.T, 2, value, true);
      break;
    case "enum":
      writeScalar(writer, ScalarType.INT32, 2, value, true);
      break;
    case "message":
      writer.tag(2, WireType.LengthDelimited).bytes(value.toBinary(options));
      break;
  }
  writer.join();
}
function writeMessageField(writer, options, field, value) {
  const message = wrapField(field.T, value);
  if (field === null || field === void 0 ? void 0 : field.delimited)
    writer.tag(field.no, WireType.StartGroup).raw(message.toBinary(options)).tag(field.no, WireType.EndGroup);
  else
    writer.tag(field.no, WireType.LengthDelimited).bytes(message.toBinary(options));
}
function writeScalar(writer, type, fieldNo, value, emitIntrinsicDefault) {
  let [wireType, method, isIntrinsicDefault] = scalarTypeInfo(type, value);
  if (!isIntrinsicDefault || emitIntrinsicDefault) {
    writer.tag(fieldNo, wireType)[method](value);
  }
}
function writePacked(writer, type, fieldNo, value) {
  if (!value.length) {
    return;
  }
  writer.tag(fieldNo, WireType.LengthDelimited).fork();
  let [, method] = scalarTypeInfo(type);
  for (let i = 0; i < value.length; i++) {
    writer[method](value[i]);
  }
  writer.join();
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/private/binary-format-proto3.js
function makeBinaryFormatProto3() {
  return Object.assign(Object.assign({}, makeBinaryFormatCommon()), {
    writeField,
    writeMessage(message, writer, options) {
      const type = message.getType();
      for (const field of type.fields.byNumber()) {
        let value, localName = field.localName;
        if (field.oneof) {
          const oneof = message[field.oneof.localName];
          if (oneof.case !== localName) {
            continue;
          }
          value = oneof.value;
        } else {
          value = message[localName];
        }
        writeField(field, value, writer, options);
      }
      if (options.writeUnknownFields) {
        this.writeUnknownFields(message, writer);
      }
      return writer;
    }
  });
}
function writeField(field, value, writer, options) {
  const repeated = field.repeated;
  switch (field.kind) {
    case "scalar":
    case "enum":
      let scalarType = field.kind == "enum" ? ScalarType.INT32 : field.T;
      if (repeated) {
        if (field.packed) {
          writePacked(writer, scalarType, field.no, value);
        } else {
          for (const item of value) {
            writeScalar(writer, scalarType, field.no, item, true);
          }
        }
      } else if (value !== void 0) {
        writeScalar(writer, scalarType, field.no, value, !!field.oneof || field.opt);
      }
      break;
    case "message":
      if (repeated) {
        for (const item of value) {
          writeMessageField(writer, options, field, item);
        }
      } else if (value !== void 0) {
        writeMessageField(writer, options, field, value);
      }
      break;
    case "map":
      for (const [key, val] of Object.entries(value)) {
        writeMapEntry(writer, options, field, key, val);
      }
      break;
  }
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/proto-base64.js
var encTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
var decTable = [];
for (let i = 0; i < encTable.length; i++)
  decTable[encTable[i].charCodeAt(0)] = i;
decTable["-".charCodeAt(0)] = encTable.indexOf("+");
decTable["_".charCodeAt(0)] = encTable.indexOf("/");
var protoBase64 = {
  /**
   * Decodes a base64 string to a byte array.
   *
   * - ignores white-space, including line breaks and tabs
   * - allows inner padding (can decode concatenated base64 strings)
   * - does not require padding
   * - understands base64url encoding:
   *   "-" instead of "+",
   *   "_" instead of "/",
   *   no padding
   */
  dec(base64Str) {
    let es = base64Str.length * 3 / 4;
    if (base64Str[base64Str.length - 2] == "=")
      es -= 2;
    else if (base64Str[base64Str.length - 1] == "=")
      es -= 1;
    let bytes = new Uint8Array(es), bytePos = 0, groupPos = 0, b, p = 0;
    for (let i = 0; i < base64Str.length; i++) {
      b = decTable[base64Str.charCodeAt(i)];
      if (b === void 0) {
        switch (base64Str[i]) {
          case "=":
            groupPos = 0;
          case "\n":
          case "\r":
          case "	":
          case " ":
            continue;
          default:
            throw Error("invalid base64 string.");
        }
      }
      switch (groupPos) {
        case 0:
          p = b;
          groupPos = 1;
          break;
        case 1:
          bytes[bytePos++] = p << 2 | (b & 48) >> 4;
          p = b;
          groupPos = 2;
          break;
        case 2:
          bytes[bytePos++] = (p & 15) << 4 | (b & 60) >> 2;
          p = b;
          groupPos = 3;
          break;
        case 3:
          bytes[bytePos++] = (p & 3) << 6 | b;
          groupPos = 0;
          break;
      }
    }
    if (groupPos == 1)
      throw Error("invalid base64 string.");
    return bytes.subarray(0, bytePos);
  },
  /**
   * Encode a byte array to a base64 string.
   */
  enc(bytes) {
    let base64 = "", groupPos = 0, b, p = 0;
    for (let i = 0; i < bytes.length; i++) {
      b = bytes[i];
      switch (groupPos) {
        case 0:
          base64 += encTable[b >> 2];
          p = (b & 3) << 4;
          groupPos = 1;
          break;
        case 1:
          base64 += encTable[p | b >> 4];
          p = (b & 15) << 2;
          groupPos = 2;
          break;
        case 2:
          base64 += encTable[p | b >> 6];
          base64 += encTable[b & 63];
          groupPos = 0;
          break;
      }
    }
    if (groupPos) {
      base64 += encTable[p];
      base64 += "=";
      if (groupPos == 1)
        base64 += "=";
    }
    return base64;
  }
};

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/extension-accessor.js
function getExtension(message, extension, options) {
  assertExtendee(extension, message);
  const opt = extension.runtime.bin.makeReadOptions(options);
  const ufs = filterUnknownFields(message.getType().runtime.bin.listUnknownFields(message), extension.field);
  const [container, get] = createExtensionContainer(extension);
  for (const uf of ufs) {
    extension.runtime.bin.readField(container, opt.readerFactory(uf.data), extension.field, uf.wireType, opt);
  }
  return get();
}
function setExtension(message, extension, value, options) {
  assertExtendee(extension, message);
  const readOpt = extension.runtime.bin.makeReadOptions(options);
  const writeOpt = extension.runtime.bin.makeWriteOptions(options);
  if (hasExtension(message, extension)) {
    const ufs = message.getType().runtime.bin.listUnknownFields(message).filter((uf) => uf.no != extension.field.no);
    message.getType().runtime.bin.discardUnknownFields(message);
    for (const uf of ufs) {
      message.getType().runtime.bin.onUnknownField(message, uf.no, uf.wireType, uf.data);
    }
  }
  const writer = writeOpt.writerFactory();
  let f = extension.field;
  if (!f.opt && !f.repeated && (f.kind == "enum" || f.kind == "scalar")) {
    f = Object.assign(Object.assign({}, extension.field), { opt: true });
  }
  extension.runtime.bin.writeField(f, value, writer, writeOpt);
  const reader = readOpt.readerFactory(writer.finish());
  while (reader.pos < reader.len) {
    const [no, wireType] = reader.tag();
    const data = reader.skip(wireType);
    message.getType().runtime.bin.onUnknownField(message, no, wireType, data);
  }
}
function hasExtension(message, extension) {
  const messageType = message.getType();
  return extension.extendee.typeName === messageType.typeName && !!messageType.runtime.bin.listUnknownFields(message).find((uf) => uf.no == extension.field.no);
}
function assertExtendee(extension, message) {
  assert(extension.extendee.typeName == message.getType().typeName, `extension ${extension.typeName} can only be applied to message ${extension.extendee.typeName}`);
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/private/json-format-common.js
var jsonReadDefaults = {
  ignoreUnknownFields: false
};
var jsonWriteDefaults = {
  emitDefaultValues: false,
  enumAsInteger: false,
  useProtoFieldName: false,
  prettySpaces: 0
};
function makeReadOptions2(options) {
  return options ? Object.assign(Object.assign({}, jsonReadDefaults), options) : jsonReadDefaults;
}
function makeWriteOptions2(options) {
  return options ? Object.assign(Object.assign({}, jsonWriteDefaults), options) : jsonWriteDefaults;
}
function makeJsonFormatCommon(nullAsZeroValue, makeWriteField) {
  const writeField2 = makeWriteField(writeEnum, writeScalar2);
  return {
    makeReadOptions: makeReadOptions2,
    makeWriteOptions: makeWriteOptions2,
    readMessage(type, json, options, message) {
      if (json == null || Array.isArray(json) || typeof json != "object") {
        throw new Error(`cannot decode message ${type.typeName} from JSON: ${debugJsonValue(json)}`);
      }
      message = message !== null && message !== void 0 ? message : new type();
      const oneofSeen = /* @__PURE__ */ new Map();
      const registry = options.typeRegistry;
      for (const [jsonKey, jsonValue] of Object.entries(json)) {
        const field = type.fields.findJsonName(jsonKey);
        if (field) {
          if (field.oneof) {
            if (jsonValue === null && field.kind == "scalar") {
              continue;
            }
            const seen = oneofSeen.get(field.oneof);
            if (seen !== void 0) {
              throw new Error(`cannot decode message ${type.typeName} from JSON: multiple keys for oneof "${field.oneof.name}" present: "${seen}", "${jsonKey}"`);
            }
            oneofSeen.set(field.oneof, jsonKey);
          }
          readField2(message, jsonValue, field, options, type, nullAsZeroValue);
        } else {
          let found = false;
          if ((registry === null || registry === void 0 ? void 0 : registry.findExtension) && jsonKey.startsWith("[") && jsonKey.endsWith("]")) {
            const ext = registry.findExtension(jsonKey.substring(1, jsonKey.length - 1));
            if (ext && ext.extendee.typeName == type.typeName) {
              found = true;
              const [container, get] = createExtensionContainer(ext);
              readField2(container, jsonValue, ext.field, options, ext, true);
              setExtension(message, ext, get(), options);
            }
          }
          if (!found && !options.ignoreUnknownFields) {
            throw new Error(`cannot decode message ${type.typeName} from JSON: key "${jsonKey}" is unknown`);
          }
        }
      }
      return message;
    },
    writeMessage(message, options) {
      const type = message.getType();
      const json = {};
      let field;
      try {
        for (const member of type.fields.byMember()) {
          let jsonValue;
          if (member.kind == "oneof") {
            const oneof = message[member.localName];
            if (oneof.value === void 0) {
              continue;
            }
            field = member.findField(oneof.case);
            if (!field) {
              throw "oneof case not found: " + oneof.case;
            }
            jsonValue = writeField2(field, oneof.value, options);
          } else {
            field = member;
            jsonValue = writeField2(field, message[field.localName], options);
          }
          if (jsonValue !== void 0) {
            json[options.useProtoFieldName ? field.name : field.jsonName] = jsonValue;
          }
        }
        const registry = options.typeRegistry;
        if (registry === null || registry === void 0 ? void 0 : registry.findExtensionFor) {
          for (const uf of type.runtime.bin.listUnknownFields(message)) {
            const ext = registry.findExtensionFor(type.typeName, uf.no);
            if (ext && hasExtension(message, ext)) {
              const value = getExtension(message, ext, options);
              const jsonValue = writeField2(ext.field, value, options);
              if (jsonValue !== void 0) {
                json[ext.field.jsonName] = jsonValue;
              }
            }
          }
        }
      } catch (e) {
        const m = field ? `cannot encode field ${type.typeName}.${field.name} to JSON` : `cannot encode message ${type.typeName} to JSON`;
        const r = e instanceof Error ? e.message : String(e);
        throw new Error(m + (r.length > 0 ? `: ${r}` : ""));
      }
      return json;
    },
    readScalar: (type, json, longType) => readScalar2(type, json, longType, nullAsZeroValue),
    // eslint-disable-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
    writeScalar: writeScalar2,
    debug: debugJsonValue
  };
}
function debugJsonValue(json) {
  if (json === null) {
    return "null";
  }
  switch (typeof json) {
    case "object":
      return Array.isArray(json) ? "array" : "object";
    case "string":
      return json.length > 100 ? "string" : `"${json.split('"').join('\\"')}"`;
    default:
      return String(json);
  }
}
function readField2(target, jsonValue, field, options, type, nullAsZeroValue) {
  let localName = field.localName;
  if (field.oneof) {
    if (jsonValue === null && field.kind == "scalar") {
      return;
    }
    target = target[field.oneof.localName] = { case: localName };
    localName = "value";
  }
  if (field.repeated) {
    if (jsonValue === null) {
      return;
    }
    if (!Array.isArray(jsonValue)) {
      throw new Error(`cannot decode field ${type.typeName}.${field.name} from JSON: ${debugJsonValue(jsonValue)}`);
    }
    const targetArray = target[localName];
    for (const jsonItem of jsonValue) {
      if (jsonItem === null) {
        throw new Error(`cannot decode field ${type.typeName}.${field.name} from JSON: ${debugJsonValue(jsonItem)}`);
      }
      let val;
      switch (field.kind) {
        case "message":
          val = field.T.fromJson(jsonItem, options);
          break;
        case "enum":
          val = readEnum(field.T, jsonItem, options.ignoreUnknownFields, true);
          if (val === void 0)
            continue;
          break;
        case "scalar":
          try {
            val = readScalar2(field.T, jsonItem, field.L, true);
          } catch (e) {
            let m = `cannot decode field ${type.typeName}.${field.name} from JSON: ${debugJsonValue(jsonItem)}`;
            if (e instanceof Error && e.message.length > 0) {
              m += `: ${e.message}`;
            }
            throw new Error(m);
          }
          break;
      }
      targetArray.push(val);
    }
  } else if (field.kind == "map") {
    if (jsonValue === null) {
      return;
    }
    if (typeof jsonValue != "object" || Array.isArray(jsonValue)) {
      throw new Error(`cannot decode field ${type.typeName}.${field.name} from JSON: ${debugJsonValue(jsonValue)}`);
    }
    const targetMap = target[localName];
    for (const [jsonMapKey, jsonMapValue] of Object.entries(jsonValue)) {
      if (jsonMapValue === null) {
        throw new Error(`cannot decode field ${type.typeName}.${field.name} from JSON: map value null`);
      }
      let val;
      switch (field.V.kind) {
        case "message":
          val = field.V.T.fromJson(jsonMapValue, options);
          break;
        case "enum":
          val = readEnum(field.V.T, jsonMapValue, options.ignoreUnknownFields, true);
          if (val === void 0)
            continue;
          break;
        case "scalar":
          try {
            val = readScalar2(field.V.T, jsonMapValue, LongType.BIGINT, true);
          } catch (e) {
            let m = `cannot decode map value for field ${type.typeName}.${field.name} from JSON: ${debugJsonValue(jsonValue)}`;
            if (e instanceof Error && e.message.length > 0) {
              m += `: ${e.message}`;
            }
            throw new Error(m);
          }
          break;
      }
      try {
        targetMap[readScalar2(field.K, field.K == ScalarType.BOOL ? jsonMapKey == "true" ? true : jsonMapKey == "false" ? false : jsonMapKey : jsonMapKey, LongType.BIGINT, true).toString()] = val;
      } catch (e) {
        let m = `cannot decode map key for field ${type.typeName}.${field.name} from JSON: ${debugJsonValue(jsonValue)}`;
        if (e instanceof Error && e.message.length > 0) {
          m += `: ${e.message}`;
        }
        throw new Error(m);
      }
    }
  } else {
    switch (field.kind) {
      case "message":
        const messageType = field.T;
        if (jsonValue === null && messageType.typeName != "google.protobuf.Value") {
          if (field.oneof) {
            throw new Error(`cannot decode field ${type.typeName}.${field.name} from JSON: null is invalid for oneof field`);
          }
          return;
        }
        if (target[localName] instanceof Message) {
          target[localName].fromJson(jsonValue, options);
        } else {
          target[localName] = messageType.fromJson(jsonValue, options);
          if (messageType.fieldWrapper && !field.oneof) {
            target[localName] = messageType.fieldWrapper.unwrapField(target[localName]);
          }
        }
        break;
      case "enum":
        const enumValue = readEnum(field.T, jsonValue, options.ignoreUnknownFields, nullAsZeroValue);
        if (enumValue !== void 0) {
          target[localName] = enumValue;
        }
        break;
      case "scalar":
        try {
          target[localName] = readScalar2(field.T, jsonValue, field.L, nullAsZeroValue);
        } catch (e) {
          let m = `cannot decode field ${type.typeName}.${field.name} from JSON: ${debugJsonValue(jsonValue)}`;
          if (e instanceof Error && e.message.length > 0) {
            m += `: ${e.message}`;
          }
          throw new Error(m);
        }
        break;
    }
  }
}
function readScalar2(type, json, longType, nullAsZeroValue) {
  switch (type) {
    case ScalarType.DOUBLE:
    case ScalarType.FLOAT:
      if (json === null)
        return nullAsZeroValue ? 0 : void 0;
      if (json === "NaN")
        return Number.NaN;
      if (json === "Infinity")
        return Number.POSITIVE_INFINITY;
      if (json === "-Infinity")
        return Number.NEGATIVE_INFINITY;
      if (json === "") {
        break;
      }
      if (typeof json == "string" && json.trim().length !== json.length) {
        break;
      }
      if (typeof json != "string" && typeof json != "number") {
        break;
      }
      const float = Number(json);
      if (Number.isNaN(float)) {
        break;
      }
      if (!Number.isFinite(float)) {
        break;
      }
      if (type == ScalarType.FLOAT)
        assertFloat32(float);
      return float;
    case ScalarType.INT32:
    case ScalarType.FIXED32:
    case ScalarType.SFIXED32:
    case ScalarType.SINT32:
    case ScalarType.UINT32:
      if (json === null)
        return nullAsZeroValue ? 0 : void 0;
      let int32;
      if (typeof json == "number")
        int32 = json;
      else if (typeof json == "string" && json.length > 0) {
        if (json.trim().length === json.length)
          int32 = Number(json);
      }
      if (int32 === void 0)
        break;
      if (type == ScalarType.UINT32)
        assertUInt32(int32);
      else
        assertInt32(int32);
      return int32;
    case ScalarType.INT64:
    case ScalarType.SFIXED64:
    case ScalarType.SINT64:
      if (json === null)
        return nullAsZeroValue ? protoInt64.zero : void 0;
      if (typeof json != "number" && typeof json != "string")
        break;
      const long = protoInt64.parse(json);
      return longType ? long.toString() : long;
    case ScalarType.FIXED64:
    case ScalarType.UINT64:
      if (json === null)
        return nullAsZeroValue ? protoInt64.zero : void 0;
      if (typeof json != "number" && typeof json != "string")
        break;
      const uLong = protoInt64.uParse(json);
      return longType ? uLong.toString() : uLong;
    case ScalarType.BOOL:
      if (json === null)
        return nullAsZeroValue ? false : void 0;
      if (typeof json !== "boolean")
        break;
      return json;
    case ScalarType.STRING:
      if (json === null)
        return nullAsZeroValue ? "" : void 0;
      if (typeof json !== "string") {
        break;
      }
      try {
        encodeURIComponent(json);
      } catch (e) {
        throw new Error("invalid UTF8");
      }
      return json;
    case ScalarType.BYTES:
      if (json === null)
        return nullAsZeroValue ? new Uint8Array(0) : void 0;
      if (json === "")
        return new Uint8Array(0);
      if (typeof json !== "string")
        break;
      return protoBase64.dec(json);
  }
  throw new Error();
}
function readEnum(type, json, ignoreUnknownFields, nullAsZeroValue) {
  if (json === null) {
    return nullAsZeroValue ? type.values[0].no : void 0;
  }
  switch (typeof json) {
    case "number":
      if (Number.isInteger(json)) {
        return json;
      }
      break;
    case "string":
      const value = type.findName(json);
      if (value || ignoreUnknownFields) {
        return value === null || value === void 0 ? void 0 : value.no;
      }
      break;
  }
  throw new Error(`cannot decode enum ${type.typeName} from JSON: ${debugJsonValue(json)}`);
}
function writeEnum(type, value, emitZeroValue, enumAsInteger) {
  var _a;
  if (value === void 0) {
    return value;
  }
  if (!emitZeroValue && type.values[0].no === value) {
    return void 0;
  }
  if (enumAsInteger) {
    return value;
  }
  if (type.typeName == "google.protobuf.NullValue") {
    return null;
  }
  const val = type.findNumber(value);
  return (_a = val === null || val === void 0 ? void 0 : val.name) !== null && _a !== void 0 ? _a : value;
}
function writeScalar2(type, value, emitZeroValue) {
  if (value === void 0) {
    return void 0;
  }
  switch (type) {
    case ScalarType.INT32:
    case ScalarType.SFIXED32:
    case ScalarType.SINT32:
    case ScalarType.FIXED32:
    case ScalarType.UINT32:
      assert(typeof value == "number");
      return value != 0 || emitZeroValue ? value : void 0;
    case ScalarType.FLOAT:
    case ScalarType.DOUBLE:
      assert(typeof value == "number");
      if (Number.isNaN(value))
        return "NaN";
      if (value === Number.POSITIVE_INFINITY)
        return "Infinity";
      if (value === Number.NEGATIVE_INFINITY)
        return "-Infinity";
      return value !== 0 || emitZeroValue ? value : void 0;
    case ScalarType.STRING:
      assert(typeof value == "string");
      return value.length > 0 || emitZeroValue ? value : void 0;
    case ScalarType.BOOL:
      assert(typeof value == "boolean");
      return value || emitZeroValue ? value : void 0;
    case ScalarType.UINT64:
    case ScalarType.FIXED64:
    case ScalarType.INT64:
    case ScalarType.SFIXED64:
    case ScalarType.SINT64:
      assert(typeof value == "bigint" || typeof value == "string" || typeof value == "number");
      return emitZeroValue || value != 0 ? value.toString(10) : void 0;
    case ScalarType.BYTES:
      assert(value instanceof Uint8Array);
      return emitZeroValue || value.byteLength > 0 ? protoBase64.enc(value) : void 0;
  }
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/private/json-format-proto3.js
function makeJsonFormatProto3() {
  return makeJsonFormatCommon(true, (writeEnum2, writeScalar3) => {
    return function writeField2(field, value, options) {
      if (field.kind == "map") {
        const jsonObj = {};
        switch (field.V.kind) {
          case "scalar":
            for (const [entryKey, entryValue] of Object.entries(value)) {
              const val = writeScalar3(field.V.T, entryValue, true);
              assert(val !== void 0);
              jsonObj[entryKey.toString()] = val;
            }
            break;
          case "message":
            for (const [entryKey, entryValue] of Object.entries(value)) {
              jsonObj[entryKey.toString()] = entryValue.toJson(options);
            }
            break;
          case "enum":
            const enumType = field.V.T;
            for (const [entryKey, entryValue] of Object.entries(value)) {
              assert(entryValue === void 0 || typeof entryValue == "number");
              const val = writeEnum2(enumType, entryValue, true, options.enumAsInteger);
              assert(val !== void 0);
              jsonObj[entryKey.toString()] = val;
            }
            break;
        }
        return options.emitDefaultValues || Object.keys(jsonObj).length > 0 ? jsonObj : void 0;
      } else if (field.repeated) {
        const jsonArr = [];
        switch (field.kind) {
          case "scalar":
            for (let i = 0; i < value.length; i++) {
              jsonArr.push(writeScalar3(field.T, value[i], true));
            }
            break;
          case "enum":
            for (let i = 0; i < value.length; i++) {
              jsonArr.push(writeEnum2(field.T, value[i], true, options.enumAsInteger));
            }
            break;
          case "message":
            for (let i = 0; i < value.length; i++) {
              jsonArr.push(value[i].toJson(options));
            }
            break;
        }
        return options.emitDefaultValues || jsonArr.length > 0 ? jsonArr : void 0;
      } else {
        if (value === void 0) {
          return void 0;
        }
        switch (field.kind) {
          case "scalar":
            return writeScalar3(field.T, value, !!field.oneof || field.opt || options.emitDefaultValues);
          case "enum":
            return writeEnum2(field.T, value, !!field.oneof || field.opt || options.emitDefaultValues, options.enumAsInteger);
          case "message":
            return wrapField(field.T, value).toJson(options);
        }
      }
    };
  });
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/private/util-common.js
function makeUtilCommon() {
  return {
    setEnumType,
    initPartial(source, target) {
      if (source === void 0) {
        return;
      }
      const type = target.getType();
      for (const member of type.fields.byMember()) {
        const localName = member.localName, t = target, s = source;
        if (s[localName] === void 0) {
          continue;
        }
        switch (member.kind) {
          case "oneof":
            const sk = s[localName].case;
            if (sk === void 0) {
              continue;
            }
            const sourceField = member.findField(sk);
            let val = s[localName].value;
            if (sourceField && sourceField.kind == "message" && !(val instanceof sourceField.T)) {
              val = new sourceField.T(val);
            } else if (sourceField && sourceField.kind === "scalar" && sourceField.T === ScalarType.BYTES) {
              val = toU8Arr(val);
            }
            t[localName] = { case: sk, value: val };
            break;
          case "scalar":
          case "enum":
            let copy = s[localName];
            if (member.T === ScalarType.BYTES) {
              copy = member.repeated ? copy.map(toU8Arr) : toU8Arr(copy);
            }
            t[localName] = copy;
            break;
          case "map":
            switch (member.V.kind) {
              case "scalar":
              case "enum":
                if (member.V.T === ScalarType.BYTES) {
                  for (const [k, v] of Object.entries(s[localName])) {
                    t[localName][k] = toU8Arr(v);
                  }
                } else {
                  Object.assign(t[localName], s[localName]);
                }
                break;
              case "message":
                const messageType = member.V.T;
                for (const k of Object.keys(s[localName])) {
                  let val2 = s[localName][k];
                  if (!messageType.fieldWrapper) {
                    val2 = new messageType(val2);
                  }
                  t[localName][k] = val2;
                }
                break;
            }
            break;
          case "message":
            const mt = member.T;
            if (member.repeated) {
              t[localName] = s[localName].map((val2) => val2 instanceof mt ? val2 : new mt(val2));
            } else if (s[localName] !== void 0) {
              const val2 = s[localName];
              if (mt.fieldWrapper) {
                if (
                  // We can't use BytesValue.typeName as that will create a circular import
                  mt.typeName === "google.protobuf.BytesValue"
                ) {
                  t[localName] = toU8Arr(val2);
                } else {
                  t[localName] = val2;
                }
              } else {
                t[localName] = val2 instanceof mt ? val2 : new mt(val2);
              }
            }
            break;
        }
      }
    },
    equals(type, a, b) {
      if (a === b) {
        return true;
      }
      if (!a || !b) {
        return false;
      }
      return type.fields.byMember().every((m) => {
        const va = a[m.localName];
        const vb = b[m.localName];
        if (m.repeated) {
          if (va.length !== vb.length) {
            return false;
          }
          switch (m.kind) {
            case "message":
              return va.every((a2, i) => m.T.equals(a2, vb[i]));
            case "scalar":
              return va.every((a2, i) => scalarEquals(m.T, a2, vb[i]));
            case "enum":
              return va.every((a2, i) => scalarEquals(ScalarType.INT32, a2, vb[i]));
          }
          throw new Error(`repeated cannot contain ${m.kind}`);
        }
        switch (m.kind) {
          case "message":
            return m.T.equals(va, vb);
          case "enum":
            return scalarEquals(ScalarType.INT32, va, vb);
          case "scalar":
            return scalarEquals(m.T, va, vb);
          case "oneof":
            if (va.case !== vb.case) {
              return false;
            }
            const s = m.findField(va.case);
            if (s === void 0) {
              return true;
            }
            switch (s.kind) {
              case "message":
                return s.T.equals(va.value, vb.value);
              case "enum":
                return scalarEquals(ScalarType.INT32, va.value, vb.value);
              case "scalar":
                return scalarEquals(s.T, va.value, vb.value);
            }
            throw new Error(`oneof cannot contain ${s.kind}`);
          case "map":
            const keys = Object.keys(va).concat(Object.keys(vb));
            switch (m.V.kind) {
              case "message":
                const messageType = m.V.T;
                return keys.every((k) => messageType.equals(va[k], vb[k]));
              case "enum":
                return keys.every((k) => scalarEquals(ScalarType.INT32, va[k], vb[k]));
              case "scalar":
                const scalarType = m.V.T;
                return keys.every((k) => scalarEquals(scalarType, va[k], vb[k]));
            }
            break;
        }
      });
    },
    clone(message) {
      const type = message.getType(), target = new type(), any = target;
      for (const member of type.fields.byMember()) {
        const source = message[member.localName];
        let copy;
        if (member.repeated) {
          copy = source.map(cloneSingularField);
        } else if (member.kind == "map") {
          copy = any[member.localName];
          for (const [key, v] of Object.entries(source)) {
            copy[key] = cloneSingularField(v);
          }
        } else if (member.kind == "oneof") {
          const f = member.findField(source.case);
          copy = f ? { case: source.case, value: cloneSingularField(source.value) } : { case: void 0 };
        } else {
          copy = cloneSingularField(source);
        }
        any[member.localName] = copy;
      }
      return target;
    }
  };
}
function cloneSingularField(value) {
  if (value === void 0) {
    return value;
  }
  if (value instanceof Message) {
    return value.clone();
  }
  if (value instanceof Uint8Array) {
    const c = new Uint8Array(value.byteLength);
    c.set(value);
    return c;
  }
  return value;
}
function toU8Arr(input) {
  return input instanceof Uint8Array ? input : new Uint8Array(input);
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/private/field-list.js
var InternalFieldList = class {
  constructor(fields, normalizer) {
    this._fields = fields;
    this._normalizer = normalizer;
  }
  findJsonName(jsonName) {
    if (!this.jsonNames) {
      const t = {};
      for (const f of this.list()) {
        t[f.jsonName] = t[f.name] = f;
      }
      this.jsonNames = t;
    }
    return this.jsonNames[jsonName];
  }
  find(fieldNo) {
    if (!this.numbers) {
      const t = {};
      for (const f of this.list()) {
        t[f.no] = f;
      }
      this.numbers = t;
    }
    return this.numbers[fieldNo];
  }
  list() {
    if (!this.all) {
      this.all = this._normalizer(this._fields);
    }
    return this.all;
  }
  byNumber() {
    if (!this.numbersAsc) {
      this.numbersAsc = this.list().concat().sort((a, b) => a.no - b.no);
    }
    return this.numbersAsc;
  }
  byMember() {
    if (!this.members) {
      this.members = [];
      const a = this.members;
      let o;
      for (const f of this.list()) {
        if (f.oneof) {
          if (f.oneof !== o) {
            o = f.oneof;
            a.push(o);
          }
        } else {
          a.push(f);
        }
      }
    }
    return this.members;
  }
};

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/private/names.js
function localFieldName(protoName, inOneof) {
  const name = protoCamelCase(protoName);
  if (inOneof) {
    return name;
  }
  return safeObjectProperty(safeMessageProperty(name));
}
function localOneofName(protoName) {
  return localFieldName(protoName, false);
}
var fieldJsonName = protoCamelCase;
function protoCamelCase(snakeCase) {
  let capNext = false;
  const b = [];
  for (let i = 0; i < snakeCase.length; i++) {
    let c = snakeCase.charAt(i);
    switch (c) {
      case "_":
        capNext = true;
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        b.push(c);
        capNext = false;
        break;
      default:
        if (capNext) {
          capNext = false;
          c = c.toUpperCase();
        }
        b.push(c);
        break;
    }
  }
  return b.join("");
}
var reservedObjectProperties = /* @__PURE__ */ new Set([
  // names reserved by JavaScript
  "constructor",
  "toString",
  "toJSON",
  "valueOf"
]);
var reservedMessageProperties = /* @__PURE__ */ new Set([
  // names reserved by the runtime
  "getType",
  "clone",
  "equals",
  "fromBinary",
  "fromJson",
  "fromJsonString",
  "toBinary",
  "toJson",
  "toJsonString",
  // names reserved by the runtime for the future
  "toObject"
]);
var fallback = (name) => `${name}$`;
var safeMessageProperty = (name) => {
  if (reservedMessageProperties.has(name)) {
    return fallback(name);
  }
  return name;
};
var safeObjectProperty = (name) => {
  if (reservedObjectProperties.has(name)) {
    return fallback(name);
  }
  return name;
};

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/private/field.js
var InternalOneofInfo = class {
  constructor(name) {
    this.kind = "oneof";
    this.repeated = false;
    this.packed = false;
    this.opt = false;
    this.default = void 0;
    this.fields = [];
    this.name = name;
    this.localName = localOneofName(name);
  }
  addField(field) {
    assert(field.oneof === this, `field ${field.name} not one of ${this.name}`);
    this.fields.push(field);
  }
  findField(localName) {
    if (!this._lookup) {
      this._lookup = /* @__PURE__ */ Object.create(null);
      for (let i = 0; i < this.fields.length; i++) {
        this._lookup[this.fields[i].localName] = this.fields[i];
      }
    }
    return this._lookup[localName];
  }
};

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/proto3.js
var proto3 = makeProtoRuntime("proto3", makeJsonFormatProto3(), makeBinaryFormatProto3(), Object.assign(Object.assign({}, makeUtilCommon()), {
  newFieldList(fields) {
    return new InternalFieldList(fields, normalizeFieldInfosProto3);
  },
  initFields(target) {
    for (const member of target.getType().fields.byMember()) {
      if (member.opt) {
        continue;
      }
      const name = member.localName, t = target;
      if (member.repeated) {
        t[name] = [];
        continue;
      }
      switch (member.kind) {
        case "oneof":
          t[name] = { case: void 0 };
          break;
        case "enum":
          t[name] = 0;
          break;
        case "map":
          t[name] = {};
          break;
        case "scalar":
          t[name] = scalarDefaultValue(member.T, member.L);
          break;
        case "message":
          break;
      }
    }
  }
}));
function normalizeFieldInfosProto3(fieldInfos) {
  var _a, _b, _c, _d;
  const r = [];
  let o;
  for (const field of typeof fieldInfos == "function" ? fieldInfos() : fieldInfos) {
    const f = field;
    f.localName = localFieldName(field.name, field.oneof !== void 0);
    f.jsonName = (_a = field.jsonName) !== null && _a !== void 0 ? _a : fieldJsonName(field.name);
    f.repeated = (_b = field.repeated) !== null && _b !== void 0 ? _b : false;
    if (field.kind == "scalar") {
      f.L = (_c = field.L) !== null && _c !== void 0 ? _c : LongType.BIGINT;
    }
    if (field.oneof !== void 0) {
      const ooname = typeof field.oneof == "string" ? field.oneof : field.oneof.name;
      if (!o || o.name != ooname) {
        o = new InternalOneofInfo(ooname);
      }
      f.oneof = o;
      o.addField(f);
    }
    if (field.kind == "message") {
      f.delimited = false;
    }
    f.packed = (_d = field.packed) !== null && _d !== void 0 ? _d : field.kind == "enum" || field.kind == "scalar" && field.T != ScalarType.BYTES && field.T != ScalarType.STRING;
    r.push(f);
  }
  return r;
}

// ../node_modules/.pnpm/@bufbuild+protobuf@1.7.2/node_modules/@bufbuild/protobuf/dist/esm/google/protobuf/timestamp_pb.js
var Timestamp = class _Timestamp extends Message {
  constructor(data) {
    super();
    this.seconds = protoInt64.zero;
    this.nanos = 0;
    proto3.util.initPartial(data, this);
  }
  fromJson(json, options) {
    if (typeof json !== "string") {
      throw new Error(`cannot decode google.protobuf.Timestamp from JSON: ${proto3.json.debug(json)}`);
    }
    const matches = json.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(?:Z|\.([0-9]{3,9})Z|([+-][0-9][0-9]:[0-9][0-9]))$/);
    if (!matches) {
      throw new Error(`cannot decode google.protobuf.Timestamp from JSON: invalid RFC 3339 string`);
    }
    const ms = Date.parse(matches[1] + "-" + matches[2] + "-" + matches[3] + "T" + matches[4] + ":" + matches[5] + ":" + matches[6] + (matches[8] ? matches[8] : "Z"));
    if (Number.isNaN(ms)) {
      throw new Error(`cannot decode google.protobuf.Timestamp from JSON: invalid RFC 3339 string`);
    }
    if (ms < Date.parse("0001-01-01T00:00:00Z") || ms > Date.parse("9999-12-31T23:59:59Z")) {
      throw new Error(`cannot decode message google.protobuf.Timestamp from JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive`);
    }
    this.seconds = protoInt64.parse(ms / 1e3);
    this.nanos = 0;
    if (matches[7]) {
      this.nanos = parseInt("1" + matches[7] + "0".repeat(9 - matches[7].length)) - 1e9;
    }
    return this;
  }
  toJson(options) {
    const ms = Number(this.seconds) * 1e3;
    if (ms < Date.parse("0001-01-01T00:00:00Z") || ms > Date.parse("9999-12-31T23:59:59Z")) {
      throw new Error(`cannot encode google.protobuf.Timestamp to JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive`);
    }
    if (this.nanos < 0) {
      throw new Error(`cannot encode google.protobuf.Timestamp to JSON: nanos must not be negative`);
    }
    let z = "Z";
    if (this.nanos > 0) {
      const nanosStr = (this.nanos + 1e9).toString().substring(1);
      if (nanosStr.substring(3) === "000000") {
        z = "." + nanosStr.substring(0, 3) + "Z";
      } else if (nanosStr.substring(6) === "000") {
        z = "." + nanosStr.substring(0, 6) + "Z";
      } else {
        z = "." + nanosStr + "Z";
      }
    }
    return new Date(ms).toISOString().replace(".000Z", z);
  }
  toDate() {
    return new Date(Number(this.seconds) * 1e3 + Math.ceil(this.nanos / 1e6));
  }
  static now() {
    return _Timestamp.fromDate(/* @__PURE__ */ new Date());
  }
  static fromDate(date) {
    const ms = date.getTime();
    return new _Timestamp({
      seconds: protoInt64.parse(Math.floor(ms / 1e3)),
      nanos: ms % 1e3 * 1e6
    });
  }
  static fromBinary(bytes, options) {
    return new _Timestamp().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _Timestamp().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _Timestamp().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_Timestamp, a, b);
  }
};
Timestamp.runtime = proto3;
Timestamp.typeName = "google.protobuf.Timestamp";
Timestamp.fields = proto3.util.newFieldList(() => [
  {
    no: 1,
    name: "seconds",
    kind: "scalar",
    T: 3
    /* ScalarType.INT64 */
  },
  {
    no: 2,
    name: "nanos",
    kind: "scalar",
    T: 5
    /* ScalarType.INT32 */
  }
]);

// gen/livekit_models_pb.js
var AudioCodec = proto3.makeEnum(
  "livekit.AudioCodec",
  [
    { no: 0, name: "DEFAULT_AC" },
    { no: 1, name: "OPUS" },
    { no: 2, name: "AAC" }
  ]
);
var VideoCodec = proto3.makeEnum(
  "livekit.VideoCodec",
  [
    { no: 0, name: "DEFAULT_VC" },
    { no: 1, name: "H264_BASELINE" },
    { no: 2, name: "H264_MAIN" },
    { no: 3, name: "H264_HIGH" },
    { no: 4, name: "VP8" }
  ]
);
var ImageCodec = proto3.makeEnum(
  "livekit.ImageCodec",
  [
    { no: 0, name: "IC_DEFAULT" },
    { no: 1, name: "IC_JPEG" }
  ]
);
var TrackType = proto3.makeEnum(
  "livekit.TrackType",
  [
    { no: 0, name: "AUDIO" },
    { no: 1, name: "VIDEO" },
    { no: 2, name: "DATA" }
  ]
);
var TrackSource = proto3.makeEnum(
  "livekit.TrackSource",
  [
    { no: 0, name: "UNKNOWN" },
    { no: 1, name: "CAMERA" },
    { no: 2, name: "MICROPHONE" },
    { no: 3, name: "SCREEN_SHARE" },
    { no: 4, name: "SCREEN_SHARE_AUDIO" }
  ]
);
var VideoQuality = proto3.makeEnum(
  "livekit.VideoQuality",
  [
    { no: 0, name: "LOW" },
    { no: 1, name: "MEDIUM" },
    { no: 2, name: "HIGH" },
    { no: 3, name: "OFF" }
  ]
);
var ConnectionQuality = proto3.makeEnum(
  "livekit.ConnectionQuality",
  [
    { no: 0, name: "POOR" },
    { no: 1, name: "GOOD" },
    { no: 2, name: "EXCELLENT" },
    { no: 3, name: "LOST" }
  ]
);
var ClientConfigSetting = proto3.makeEnum(
  "livekit.ClientConfigSetting",
  [
    { no: 0, name: "UNSET" },
    { no: 1, name: "DISABLED" },
    { no: 2, name: "ENABLED" }
  ]
);
var DisconnectReason = proto3.makeEnum(
  "livekit.DisconnectReason",
  [
    { no: 0, name: "UNKNOWN_REASON" },
    { no: 1, name: "CLIENT_INITIATED" },
    { no: 2, name: "DUPLICATE_IDENTITY" },
    { no: 3, name: "SERVER_SHUTDOWN" },
    { no: 4, name: "PARTICIPANT_REMOVED" },
    { no: 5, name: "ROOM_DELETED" },
    { no: 6, name: "STATE_MISMATCH" },
    { no: 7, name: "JOIN_FAILURE" },
    { no: 8, name: "MIGRATION" },
    { no: 9, name: "SIGNAL_CLOSE" }
  ]
);
var ReconnectReason = proto3.makeEnum(
  "livekit.ReconnectReason",
  [
    { no: 0, name: "RR_UNKNOWN" },
    { no: 1, name: "RR_SIGNAL_DISCONNECTED" },
    { no: 2, name: "RR_PUBLISHER_FAILED" },
    { no: 3, name: "RR_SUBSCRIBER_FAILED" },
    { no: 4, name: "RR_SWITCH_CANDIDATE" }
  ]
);
var SubscriptionError = proto3.makeEnum(
  "livekit.SubscriptionError",
  [
    { no: 0, name: "SE_UNKNOWN" },
    { no: 1, name: "SE_CODEC_UNSUPPORTED" },
    { no: 2, name: "SE_TRACK_NOTFOUND" }
  ]
);
var Room = proto3.makeMessageType(
  "livekit.Room",
  () => [
    {
      no: 1,
      name: "sid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "empty_timeout",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 14,
      name: "departure_timeout",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 4,
      name: "max_participants",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 5,
      name: "creation_time",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 6,
      name: "turn_password",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 7, name: "enabled_codecs", kind: "message", T: Codec, repeated: true },
    {
      no: 8,
      name: "metadata",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 9,
      name: "num_participants",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 11,
      name: "num_publishers",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 10,
      name: "active_recording",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 13, name: "version", kind: "message", T: TimedVersion }
  ]
);
var Codec = proto3.makeMessageType(
  "livekit.Codec",
  () => [
    {
      no: 1,
      name: "mime",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "fmtp_line",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var PlayoutDelay = proto3.makeMessageType(
  "livekit.PlayoutDelay",
  () => [
    {
      no: 1,
      name: "enabled",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    {
      no: 2,
      name: "min",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 3,
      name: "max",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    }
  ]
);
var ParticipantPermission = proto3.makeMessageType(
  "livekit.ParticipantPermission",
  () => [
    {
      no: 1,
      name: "can_subscribe",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    {
      no: 2,
      name: "can_publish",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    {
      no: 3,
      name: "can_publish_data",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 9, name: "can_publish_sources", kind: "enum", T: proto3.getEnumType(TrackSource), repeated: true },
    {
      no: 7,
      name: "hidden",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    {
      no: 8,
      name: "recorder",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    {
      no: 10,
      name: "can_update_metadata",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    {
      no: 11,
      name: "agent",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    }
  ]
);
var ParticipantInfo = proto3.makeMessageType(
  "livekit.ParticipantInfo",
  () => [
    {
      no: 1,
      name: "sid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "identity",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 3, name: "state", kind: "enum", T: proto3.getEnumType(ParticipantInfo_State) },
    { no: 4, name: "tracks", kind: "message", T: TrackInfo, repeated: true },
    {
      no: 5,
      name: "metadata",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 6,
      name: "joined_at",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 9,
      name: "name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 10,
      name: "version",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    { no: 11, name: "permission", kind: "message", T: ParticipantPermission },
    {
      no: 12,
      name: "region",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 13,
      name: "is_publisher",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 14, name: "kind", kind: "enum", T: proto3.getEnumType(ParticipantInfo_Kind) }
  ]
);
var ParticipantInfo_State = proto3.makeEnum(
  "livekit.ParticipantInfo.State",
  [
    { no: 0, name: "JOINING" },
    { no: 1, name: "JOINED" },
    { no: 2, name: "ACTIVE" },
    { no: 3, name: "DISCONNECTED" }
  ]
);
var ParticipantInfo_Kind = proto3.makeEnum(
  "livekit.ParticipantInfo.Kind",
  [
    { no: 0, name: "STANDARD" },
    { no: 1, name: "INGRESS" },
    { no: 2, name: "EGRESS" },
    { no: 3, name: "SIP" },
    { no: 4, name: "AGENT" }
  ]
);
var Encryption = proto3.makeMessageType(
  "livekit.Encryption",
  []
);
var Encryption_Type = proto3.makeEnum(
  "livekit.Encryption.Type",
  [
    { no: 0, name: "NONE" },
    { no: 1, name: "GCM" },
    { no: 2, name: "CUSTOM" }
  ]
);
var SimulcastCodecInfo = proto3.makeMessageType(
  "livekit.SimulcastCodecInfo",
  () => [
    {
      no: 1,
      name: "mime_type",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "mid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "cid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 4, name: "layers", kind: "message", T: VideoLayer, repeated: true }
  ]
);
var TrackInfo = proto3.makeMessageType(
  "livekit.TrackInfo",
  () => [
    {
      no: 1,
      name: "sid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 2, name: "type", kind: "enum", T: proto3.getEnumType(TrackType) },
    {
      no: 3,
      name: "name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 4,
      name: "muted",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    {
      no: 5,
      name: "width",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 6,
      name: "height",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 7,
      name: "simulcast",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    {
      no: 8,
      name: "disable_dtx",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 9, name: "source", kind: "enum", T: proto3.getEnumType(TrackSource) },
    { no: 10, name: "layers", kind: "message", T: VideoLayer, repeated: true },
    {
      no: 11,
      name: "mime_type",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 12,
      name: "mid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 13, name: "codecs", kind: "message", T: SimulcastCodecInfo, repeated: true },
    {
      no: 14,
      name: "stereo",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    {
      no: 15,
      name: "disable_red",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 16, name: "encryption", kind: "enum", T: proto3.getEnumType(Encryption_Type) },
    {
      no: 17,
      name: "stream",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 18, name: "version", kind: "message", T: TimedVersion }
  ]
);
var VideoLayer = proto3.makeMessageType(
  "livekit.VideoLayer",
  () => [
    { no: 1, name: "quality", kind: "enum", T: proto3.getEnumType(VideoQuality) },
    {
      no: 2,
      name: "width",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 3,
      name: "height",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 4,
      name: "bitrate",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 5,
      name: "ssrc",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    }
  ]
);
var DataPacket = proto3.makeMessageType(
  "livekit.DataPacket",
  () => [
    { no: 1, name: "kind", kind: "enum", T: proto3.getEnumType(DataPacket_Kind) },
    { no: 2, name: "user", kind: "message", T: UserPacket, oneof: "value" },
    { no: 3, name: "speaker", kind: "message", T: ActiveSpeakerUpdate, oneof: "value" }
  ]
);
var DataPacket_Kind = proto3.makeEnum(
  "livekit.DataPacket.Kind",
  [
    { no: 0, name: "RELIABLE" },
    { no: 1, name: "LOSSY" }
  ]
);
var ActiveSpeakerUpdate = proto3.makeMessageType(
  "livekit.ActiveSpeakerUpdate",
  () => [
    { no: 1, name: "speakers", kind: "message", T: SpeakerInfo, repeated: true }
  ]
);
var SpeakerInfo = proto3.makeMessageType(
  "livekit.SpeakerInfo",
  () => [
    {
      no: 1,
      name: "sid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "level",
      kind: "scalar",
      T: 2
      /* ScalarType.FLOAT */
    },
    {
      no: 3,
      name: "active",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    }
  ]
);
var UserPacket = proto3.makeMessageType(
  "livekit.UserPacket",
  () => [
    {
      no: 1,
      name: "participant_sid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 5,
      name: "participant_identity",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "payload",
      kind: "scalar",
      T: 12
      /* ScalarType.BYTES */
    },
    { no: 3, name: "destination_sids", kind: "scalar", T: 9, repeated: true },
    { no: 6, name: "destination_identities", kind: "scalar", T: 9, repeated: true },
    { no: 4, name: "topic", kind: "scalar", T: 9, opt: true }
  ]
);
var ParticipantTracks = proto3.makeMessageType(
  "livekit.ParticipantTracks",
  () => [
    {
      no: 1,
      name: "participant_sid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 2, name: "track_sids", kind: "scalar", T: 9, repeated: true }
  ]
);
var ServerInfo = proto3.makeMessageType(
  "livekit.ServerInfo",
  () => [
    { no: 1, name: "edition", kind: "enum", T: proto3.getEnumType(ServerInfo_Edition) },
    {
      no: 2,
      name: "version",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "protocol",
      kind: "scalar",
      T: 5
      /* ScalarType.INT32 */
    },
    {
      no: 4,
      name: "region",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 5,
      name: "node_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 6,
      name: "debug_info",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var ServerInfo_Edition = proto3.makeEnum(
  "livekit.ServerInfo.Edition",
  [
    { no: 0, name: "Standard" },
    { no: 1, name: "Cloud" }
  ]
);
var ClientInfo = proto3.makeMessageType(
  "livekit.ClientInfo",
  () => [
    { no: 1, name: "sdk", kind: "enum", T: proto3.getEnumType(ClientInfo_SDK) },
    {
      no: 2,
      name: "version",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "protocol",
      kind: "scalar",
      T: 5
      /* ScalarType.INT32 */
    },
    {
      no: 4,
      name: "os",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 5,
      name: "os_version",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 6,
      name: "device_model",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 7,
      name: "browser",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 8,
      name: "browser_version",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 9,
      name: "address",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 10,
      name: "network",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var ClientInfo_SDK = proto3.makeEnum(
  "livekit.ClientInfo.SDK",
  [
    { no: 0, name: "UNKNOWN" },
    { no: 1, name: "JS" },
    { no: 2, name: "SWIFT" },
    { no: 3, name: "ANDROID" },
    { no: 4, name: "FLUTTER" },
    { no: 5, name: "GO" },
    { no: 6, name: "UNITY" },
    { no: 7, name: "REACT_NATIVE" },
    { no: 8, name: "RUST" },
    { no: 9, name: "PYTHON" },
    { no: 10, name: "CPP" }
  ]
);
var ClientConfiguration = proto3.makeMessageType(
  "livekit.ClientConfiguration",
  () => [
    { no: 1, name: "video", kind: "message", T: VideoConfiguration },
    { no: 2, name: "screen", kind: "message", T: VideoConfiguration },
    { no: 3, name: "resume_connection", kind: "enum", T: proto3.getEnumType(ClientConfigSetting) },
    { no: 4, name: "disabled_codecs", kind: "message", T: DisabledCodecs },
    { no: 5, name: "force_relay", kind: "enum", T: proto3.getEnumType(ClientConfigSetting) }
  ]
);
var VideoConfiguration = proto3.makeMessageType(
  "livekit.VideoConfiguration",
  () => [
    { no: 1, name: "hardware_encoder", kind: "enum", T: proto3.getEnumType(ClientConfigSetting) }
  ]
);
var DisabledCodecs = proto3.makeMessageType(
  "livekit.DisabledCodecs",
  () => [
    { no: 1, name: "codecs", kind: "message", T: Codec, repeated: true },
    { no: 2, name: "publish", kind: "message", T: Codec, repeated: true }
  ]
);
var RTPDrift = proto3.makeMessageType(
  "livekit.RTPDrift",
  () => [
    { no: 1, name: "start_time", kind: "message", T: Timestamp },
    { no: 2, name: "end_time", kind: "message", T: Timestamp },
    {
      no: 3,
      name: "duration",
      kind: "scalar",
      T: 1
      /* ScalarType.DOUBLE */
    },
    {
      no: 4,
      name: "start_timestamp",
      kind: "scalar",
      T: 4
      /* ScalarType.UINT64 */
    },
    {
      no: 5,
      name: "end_timestamp",
      kind: "scalar",
      T: 4
      /* ScalarType.UINT64 */
    },
    {
      no: 6,
      name: "rtp_clock_ticks",
      kind: "scalar",
      T: 4
      /* ScalarType.UINT64 */
    },
    {
      no: 7,
      name: "drift_samples",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 8,
      name: "drift_ms",
      kind: "scalar",
      T: 1
      /* ScalarType.DOUBLE */
    },
    {
      no: 9,
      name: "clock_rate",
      kind: "scalar",
      T: 1
      /* ScalarType.DOUBLE */
    }
  ]
);
var RTPStats = proto3.makeMessageType(
  "livekit.RTPStats",
  () => [
    { no: 1, name: "start_time", kind: "message", T: Timestamp },
    { no: 2, name: "end_time", kind: "message", T: Timestamp },
    {
      no: 3,
      name: "duration",
      kind: "scalar",
      T: 1
      /* ScalarType.DOUBLE */
    },
    {
      no: 4,
      name: "packets",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 5,
      name: "packet_rate",
      kind: "scalar",
      T: 1
      /* ScalarType.DOUBLE */
    },
    {
      no: 6,
      name: "bytes",
      kind: "scalar",
      T: 4
      /* ScalarType.UINT64 */
    },
    {
      no: 39,
      name: "header_bytes",
      kind: "scalar",
      T: 4
      /* ScalarType.UINT64 */
    },
    {
      no: 7,
      name: "bitrate",
      kind: "scalar",
      T: 1
      /* ScalarType.DOUBLE */
    },
    {
      no: 8,
      name: "packets_lost",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 9,
      name: "packet_loss_rate",
      kind: "scalar",
      T: 1
      /* ScalarType.DOUBLE */
    },
    {
      no: 10,
      name: "packet_loss_percentage",
      kind: "scalar",
      T: 2
      /* ScalarType.FLOAT */
    },
    {
      no: 11,
      name: "packets_duplicate",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 12,
      name: "packet_duplicate_rate",
      kind: "scalar",
      T: 1
      /* ScalarType.DOUBLE */
    },
    {
      no: 13,
      name: "bytes_duplicate",
      kind: "scalar",
      T: 4
      /* ScalarType.UINT64 */
    },
    {
      no: 40,
      name: "header_bytes_duplicate",
      kind: "scalar",
      T: 4
      /* ScalarType.UINT64 */
    },
    {
      no: 14,
      name: "bitrate_duplicate",
      kind: "scalar",
      T: 1
      /* ScalarType.DOUBLE */
    },
    {
      no: 15,
      name: "packets_padding",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 16,
      name: "packet_padding_rate",
      kind: "scalar",
      T: 1
      /* ScalarType.DOUBLE */
    },
    {
      no: 17,
      name: "bytes_padding",
      kind: "scalar",
      T: 4
      /* ScalarType.UINT64 */
    },
    {
      no: 41,
      name: "header_bytes_padding",
      kind: "scalar",
      T: 4
      /* ScalarType.UINT64 */
    },
    {
      no: 18,
      name: "bitrate_padding",
      kind: "scalar",
      T: 1
      /* ScalarType.DOUBLE */
    },
    {
      no: 19,
      name: "packets_out_of_order",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 20,
      name: "frames",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 21,
      name: "frame_rate",
      kind: "scalar",
      T: 1
      /* ScalarType.DOUBLE */
    },
    {
      no: 22,
      name: "jitter_current",
      kind: "scalar",
      T: 1
      /* ScalarType.DOUBLE */
    },
    {
      no: 23,
      name: "jitter_max",
      kind: "scalar",
      T: 1
      /* ScalarType.DOUBLE */
    },
    { no: 24, name: "gap_histogram", kind: "map", K: 5, V: {
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    } },
    {
      no: 25,
      name: "nacks",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 37,
      name: "nack_acks",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 26,
      name: "nack_misses",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 38,
      name: "nack_repeated",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 27,
      name: "plis",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    { no: 28, name: "last_pli", kind: "message", T: Timestamp },
    {
      no: 29,
      name: "firs",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    { no: 30, name: "last_fir", kind: "message", T: Timestamp },
    {
      no: 31,
      name: "rtt_current",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 32,
      name: "rtt_max",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 33,
      name: "key_frames",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    { no: 34, name: "last_key_frame", kind: "message", T: Timestamp },
    {
      no: 35,
      name: "layer_lock_plis",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    { no: 36, name: "last_layer_lock_pli", kind: "message", T: Timestamp },
    { no: 44, name: "packet_drift", kind: "message", T: RTPDrift },
    { no: 45, name: "report_drift", kind: "message", T: RTPDrift }
  ]
);
var TimedVersion = proto3.makeMessageType(
  "livekit.TimedVersion",
  () => [
    {
      no: 1,
      name: "unix_micro",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 2,
      name: "ticks",
      kind: "scalar",
      T: 5
      /* ScalarType.INT32 */
    }
  ]
);

// gen/livekit_agent_pb.js
var JobType = proto3.makeEnum(
  "livekit.JobType",
  [
    { no: 0, name: "JT_ROOM" },
    { no: 1, name: "JT_PUBLISHER" }
  ]
);
var WorkerStatus = proto3.makeEnum(
  "livekit.WorkerStatus",
  [
    { no: 0, name: "WS_AVAILABLE" },
    { no: 1, name: "WS_FULL" }
  ]
);
var JobStatus = proto3.makeEnum(
  "livekit.JobStatus",
  [
    { no: 0, name: "JS_UNKNOWN" },
    { no: 1, name: "JS_SUCCESS" },
    { no: 2, name: "JS_FAILED" }
  ]
);
var AgentInfo = proto3.makeMessageType(
  "livekit.AgentInfo",
  () => [
    {
      no: 1,
      name: "id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "version",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var Job = proto3.makeMessageType(
  "livekit.Job",
  () => [
    {
      no: 1,
      name: "id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 2, name: "type", kind: "enum", T: proto3.getEnumType(JobType) },
    { no: 3, name: "room", kind: "message", T: Room },
    { no: 4, name: "participant", kind: "message", T: ParticipantInfo, opt: true }
  ]
);
var WorkerMessage = proto3.makeMessageType(
  "livekit.WorkerMessage",
  () => [
    { no: 1, name: "register", kind: "message", T: RegisterWorkerRequest, oneof: "message" },
    { no: 2, name: "availability", kind: "message", T: AvailabilityResponse, oneof: "message" },
    { no: 3, name: "status", kind: "message", T: UpdateWorkerStatus, oneof: "message" },
    { no: 4, name: "job_update", kind: "message", T: JobStatusUpdate, oneof: "message" }
  ]
);
var ServerMessage = proto3.makeMessageType(
  "livekit.ServerMessage",
  () => [
    { no: 1, name: "register", kind: "message", T: RegisterWorkerResponse, oneof: "message" },
    { no: 2, name: "availability", kind: "message", T: AvailabilityRequest, oneof: "message" },
    { no: 3, name: "assignment", kind: "message", T: JobAssignment, oneof: "message" }
  ]
);
var RegisterWorkerRequest = proto3.makeMessageType(
  "livekit.RegisterWorkerRequest",
  () => [
    { no: 1, name: "type", kind: "enum", T: proto3.getEnumType(JobType) },
    {
      no: 2,
      name: "worker_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "version",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 4,
      name: "name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var RegisterWorkerResponse = proto3.makeMessageType(
  "livekit.RegisterWorkerResponse",
  () => [
    {
      no: 1,
      name: "worker_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "server_version",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var AvailabilityRequest = proto3.makeMessageType(
  "livekit.AvailabilityRequest",
  () => [
    { no: 1, name: "job", kind: "message", T: Job }
  ]
);
var AvailabilityResponse = proto3.makeMessageType(
  "livekit.AvailabilityResponse",
  () => [
    {
      no: 1,
      name: "job_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "available",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    }
  ]
);
var JobStatusUpdate = proto3.makeMessageType(
  "livekit.JobStatusUpdate",
  () => [
    {
      no: 1,
      name: "job_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 2, name: "status", kind: "enum", T: proto3.getEnumType(JobStatus) },
    {
      no: 3,
      name: "error",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 4,
      name: "user_data",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var JobAssignment = proto3.makeMessageType(
  "livekit.JobAssignment",
  () => [
    { no: 1, name: "job", kind: "message", T: Job }
  ]
);
var UpdateWorkerStatus = proto3.makeMessageType(
  "livekit.UpdateWorkerStatus",
  () => [
    { no: 1, name: "status", kind: "enum", T: proto3.getEnumType(WorkerStatus) }
  ]
);

// gen/livekit_rtc_pb.js
var SignalTarget = proto3.makeEnum(
  "livekit.SignalTarget",
  [
    { no: 0, name: "PUBLISHER" },
    { no: 1, name: "SUBSCRIBER" }
  ]
);
var StreamState = proto3.makeEnum(
  "livekit.StreamState",
  [
    { no: 0, name: "ACTIVE" },
    { no: 1, name: "PAUSED" }
  ]
);
var CandidateProtocol = proto3.makeEnum(
  "livekit.CandidateProtocol",
  [
    { no: 0, name: "UDP" },
    { no: 1, name: "TCP" },
    { no: 2, name: "TLS" }
  ]
);
var SignalRequest = proto3.makeMessageType(
  "livekit.SignalRequest",
  () => [
    { no: 1, name: "offer", kind: "message", T: SessionDescription, oneof: "message" },
    { no: 2, name: "answer", kind: "message", T: SessionDescription, oneof: "message" },
    { no: 3, name: "trickle", kind: "message", T: TrickleRequest, oneof: "message" },
    { no: 4, name: "add_track", kind: "message", T: AddTrackRequest, oneof: "message" },
    { no: 5, name: "mute", kind: "message", T: MuteTrackRequest, oneof: "message" },
    { no: 6, name: "subscription", kind: "message", T: UpdateSubscription, oneof: "message" },
    { no: 7, name: "track_setting", kind: "message", T: UpdateTrackSettings, oneof: "message" },
    { no: 8, name: "leave", kind: "message", T: LeaveRequest, oneof: "message" },
    { no: 10, name: "update_layers", kind: "message", T: UpdateVideoLayers, oneof: "message" },
    { no: 11, name: "subscription_permission", kind: "message", T: SubscriptionPermission, oneof: "message" },
    { no: 12, name: "sync_state", kind: "message", T: SyncState, oneof: "message" },
    { no: 13, name: "simulate", kind: "message", T: SimulateScenario, oneof: "message" },
    { no: 14, name: "ping", kind: "scalar", T: 3, oneof: "message" },
    { no: 15, name: "update_metadata", kind: "message", T: UpdateParticipantMetadata, oneof: "message" },
    { no: 16, name: "ping_req", kind: "message", T: Ping, oneof: "message" }
  ]
);
var SignalResponse = proto3.makeMessageType(
  "livekit.SignalResponse",
  () => [
    { no: 1, name: "join", kind: "message", T: JoinResponse, oneof: "message" },
    { no: 2, name: "answer", kind: "message", T: SessionDescription, oneof: "message" },
    { no: 3, name: "offer", kind: "message", T: SessionDescription, oneof: "message" },
    { no: 4, name: "trickle", kind: "message", T: TrickleRequest, oneof: "message" },
    { no: 5, name: "update", kind: "message", T: ParticipantUpdate, oneof: "message" },
    { no: 6, name: "track_published", kind: "message", T: TrackPublishedResponse, oneof: "message" },
    { no: 8, name: "leave", kind: "message", T: LeaveRequest, oneof: "message" },
    { no: 9, name: "mute", kind: "message", T: MuteTrackRequest, oneof: "message" },
    { no: 10, name: "speakers_changed", kind: "message", T: SpeakersChanged, oneof: "message" },
    { no: 11, name: "room_update", kind: "message", T: RoomUpdate, oneof: "message" },
    { no: 12, name: "connection_quality", kind: "message", T: ConnectionQualityUpdate, oneof: "message" },
    { no: 13, name: "stream_state_update", kind: "message", T: StreamStateUpdate, oneof: "message" },
    { no: 14, name: "subscribed_quality_update", kind: "message", T: SubscribedQualityUpdate, oneof: "message" },
    { no: 15, name: "subscription_permission_update", kind: "message", T: SubscriptionPermissionUpdate, oneof: "message" },
    { no: 16, name: "refresh_token", kind: "scalar", T: 9, oneof: "message" },
    { no: 17, name: "track_unpublished", kind: "message", T: TrackUnpublishedResponse, oneof: "message" },
    { no: 18, name: "pong", kind: "scalar", T: 3, oneof: "message" },
    { no: 19, name: "reconnect", kind: "message", T: ReconnectResponse, oneof: "message" },
    { no: 20, name: "pong_resp", kind: "message", T: Pong, oneof: "message" },
    { no: 21, name: "subscription_response", kind: "message", T: SubscriptionResponse, oneof: "message" }
  ]
);
var SimulcastCodec = proto3.makeMessageType(
  "livekit.SimulcastCodec",
  () => [
    {
      no: 1,
      name: "codec",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "cid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var AddTrackRequest = proto3.makeMessageType(
  "livekit.AddTrackRequest",
  () => [
    {
      no: 1,
      name: "cid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 3, name: "type", kind: "enum", T: proto3.getEnumType(TrackType) },
    {
      no: 4,
      name: "width",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 5,
      name: "height",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 6,
      name: "muted",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    {
      no: 7,
      name: "disable_dtx",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 8, name: "source", kind: "enum", T: proto3.getEnumType(TrackSource) },
    { no: 9, name: "layers", kind: "message", T: VideoLayer, repeated: true },
    { no: 10, name: "simulcast_codecs", kind: "message", T: SimulcastCodec, repeated: true },
    {
      no: 11,
      name: "sid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 12,
      name: "stereo",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    {
      no: 13,
      name: "disable_red",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 14, name: "encryption", kind: "enum", T: proto3.getEnumType(Encryption_Type) },
    {
      no: 15,
      name: "stream",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var TrickleRequest = proto3.makeMessageType(
  "livekit.TrickleRequest",
  () => [
    {
      no: 1,
      name: "candidateInit",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 2, name: "target", kind: "enum", T: proto3.getEnumType(SignalTarget) }
  ]
);
var MuteTrackRequest = proto3.makeMessageType(
  "livekit.MuteTrackRequest",
  () => [
    {
      no: 1,
      name: "sid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "muted",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    }
  ]
);
var JoinResponse = proto3.makeMessageType(
  "livekit.JoinResponse",
  () => [
    { no: 1, name: "room", kind: "message", T: Room },
    { no: 2, name: "participant", kind: "message", T: ParticipantInfo },
    { no: 3, name: "other_participants", kind: "message", T: ParticipantInfo, repeated: true },
    {
      no: 4,
      name: "server_version",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 5, name: "ice_servers", kind: "message", T: ICEServer, repeated: true },
    {
      no: 6,
      name: "subscriber_primary",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    {
      no: 7,
      name: "alternative_url",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 8, name: "client_configuration", kind: "message", T: ClientConfiguration },
    {
      no: 9,
      name: "server_region",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 10,
      name: "ping_timeout",
      kind: "scalar",
      T: 5
      /* ScalarType.INT32 */
    },
    {
      no: 11,
      name: "ping_interval",
      kind: "scalar",
      T: 5
      /* ScalarType.INT32 */
    },
    { no: 12, name: "server_info", kind: "message", T: ServerInfo },
    {
      no: 13,
      name: "sif_trailer",
      kind: "scalar",
      T: 12
      /* ScalarType.BYTES */
    }
  ]
);
var ReconnectResponse = proto3.makeMessageType(
  "livekit.ReconnectResponse",
  () => [
    { no: 1, name: "ice_servers", kind: "message", T: ICEServer, repeated: true },
    { no: 2, name: "client_configuration", kind: "message", T: ClientConfiguration }
  ]
);
var TrackPublishedResponse = proto3.makeMessageType(
  "livekit.TrackPublishedResponse",
  () => [
    {
      no: 1,
      name: "cid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 2, name: "track", kind: "message", T: TrackInfo }
  ]
);
var TrackUnpublishedResponse = proto3.makeMessageType(
  "livekit.TrackUnpublishedResponse",
  () => [
    {
      no: 1,
      name: "track_sid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var SessionDescription = proto3.makeMessageType(
  "livekit.SessionDescription",
  () => [
    {
      no: 1,
      name: "type",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "sdp",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var ParticipantUpdate = proto3.makeMessageType(
  "livekit.ParticipantUpdate",
  () => [
    { no: 1, name: "participants", kind: "message", T: ParticipantInfo, repeated: true }
  ]
);
var UpdateSubscription = proto3.makeMessageType(
  "livekit.UpdateSubscription",
  () => [
    { no: 1, name: "track_sids", kind: "scalar", T: 9, repeated: true },
    {
      no: 2,
      name: "subscribe",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 3, name: "participant_tracks", kind: "message", T: ParticipantTracks, repeated: true }
  ]
);
var UpdateTrackSettings = proto3.makeMessageType(
  "livekit.UpdateTrackSettings",
  () => [
    { no: 1, name: "track_sids", kind: "scalar", T: 9, repeated: true },
    {
      no: 3,
      name: "disabled",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 4, name: "quality", kind: "enum", T: proto3.getEnumType(VideoQuality) },
    {
      no: 5,
      name: "width",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 6,
      name: "height",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 7,
      name: "fps",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 8,
      name: "priority",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    }
  ]
);
var LeaveRequest = proto3.makeMessageType(
  "livekit.LeaveRequest",
  () => [
    {
      no: 1,
      name: "can_reconnect",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 2, name: "reason", kind: "enum", T: proto3.getEnumType(DisconnectReason) },
    { no: 3, name: "action", kind: "enum", T: proto3.getEnumType(LeaveRequest_Action) },
    { no: 4, name: "regions", kind: "message", T: RegionSettings }
  ]
);
var LeaveRequest_Action = proto3.makeEnum(
  "livekit.LeaveRequest.Action",
  [
    { no: 0, name: "DISCONNECT" },
    { no: 1, name: "RESUME" },
    { no: 2, name: "RECONNECT" }
  ]
);
var UpdateVideoLayers = proto3.makeMessageType(
  "livekit.UpdateVideoLayers",
  () => [
    {
      no: 1,
      name: "track_sid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 2, name: "layers", kind: "message", T: VideoLayer, repeated: true }
  ]
);
var UpdateParticipantMetadata = proto3.makeMessageType(
  "livekit.UpdateParticipantMetadata",
  () => [
    {
      no: 1,
      name: "metadata",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var ICEServer = proto3.makeMessageType(
  "livekit.ICEServer",
  () => [
    { no: 1, name: "urls", kind: "scalar", T: 9, repeated: true },
    {
      no: 2,
      name: "username",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "credential",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var SpeakersChanged = proto3.makeMessageType(
  "livekit.SpeakersChanged",
  () => [
    { no: 1, name: "speakers", kind: "message", T: SpeakerInfo, repeated: true }
  ]
);
var RoomUpdate = proto3.makeMessageType(
  "livekit.RoomUpdate",
  () => [
    { no: 1, name: "room", kind: "message", T: Room }
  ]
);
var ConnectionQualityInfo = proto3.makeMessageType(
  "livekit.ConnectionQualityInfo",
  () => [
    {
      no: 1,
      name: "participant_sid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 2, name: "quality", kind: "enum", T: proto3.getEnumType(ConnectionQuality) },
    {
      no: 3,
      name: "score",
      kind: "scalar",
      T: 2
      /* ScalarType.FLOAT */
    }
  ]
);
var ConnectionQualityUpdate = proto3.makeMessageType(
  "livekit.ConnectionQualityUpdate",
  () => [
    { no: 1, name: "updates", kind: "message", T: ConnectionQualityInfo, repeated: true }
  ]
);
var StreamStateInfo = proto3.makeMessageType(
  "livekit.StreamStateInfo",
  () => [
    {
      no: 1,
      name: "participant_sid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "track_sid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 3, name: "state", kind: "enum", T: proto3.getEnumType(StreamState) }
  ]
);
var StreamStateUpdate = proto3.makeMessageType(
  "livekit.StreamStateUpdate",
  () => [
    { no: 1, name: "stream_states", kind: "message", T: StreamStateInfo, repeated: true }
  ]
);
var SubscribedQuality = proto3.makeMessageType(
  "livekit.SubscribedQuality",
  () => [
    { no: 1, name: "quality", kind: "enum", T: proto3.getEnumType(VideoQuality) },
    {
      no: 2,
      name: "enabled",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    }
  ]
);
var SubscribedCodec = proto3.makeMessageType(
  "livekit.SubscribedCodec",
  () => [
    {
      no: 1,
      name: "codec",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 2, name: "qualities", kind: "message", T: SubscribedQuality, repeated: true }
  ]
);
var SubscribedQualityUpdate = proto3.makeMessageType(
  "livekit.SubscribedQualityUpdate",
  () => [
    {
      no: 1,
      name: "track_sid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 2, name: "subscribed_qualities", kind: "message", T: SubscribedQuality, repeated: true },
    { no: 3, name: "subscribed_codecs", kind: "message", T: SubscribedCodec, repeated: true }
  ]
);
var TrackPermission = proto3.makeMessageType(
  "livekit.TrackPermission",
  () => [
    {
      no: 1,
      name: "participant_sid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "all_tracks",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 3, name: "track_sids", kind: "scalar", T: 9, repeated: true },
    {
      no: 4,
      name: "participant_identity",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var SubscriptionPermission = proto3.makeMessageType(
  "livekit.SubscriptionPermission",
  () => [
    {
      no: 1,
      name: "all_participants",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 2, name: "track_permissions", kind: "message", T: TrackPermission, repeated: true }
  ]
);
var SubscriptionPermissionUpdate = proto3.makeMessageType(
  "livekit.SubscriptionPermissionUpdate",
  () => [
    {
      no: 1,
      name: "participant_sid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "track_sid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "allowed",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    }
  ]
);
var SyncState = proto3.makeMessageType(
  "livekit.SyncState",
  () => [
    { no: 1, name: "answer", kind: "message", T: SessionDescription },
    { no: 2, name: "subscription", kind: "message", T: UpdateSubscription },
    { no: 3, name: "publish_tracks", kind: "message", T: TrackPublishedResponse, repeated: true },
    { no: 4, name: "data_channels", kind: "message", T: DataChannelInfo, repeated: true },
    { no: 5, name: "offer", kind: "message", T: SessionDescription },
    { no: 6, name: "track_sids_disabled", kind: "scalar", T: 9, repeated: true }
  ]
);
var DataChannelInfo = proto3.makeMessageType(
  "livekit.DataChannelInfo",
  () => [
    {
      no: 1,
      name: "label",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "id",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    { no: 3, name: "target", kind: "enum", T: proto3.getEnumType(SignalTarget) }
  ]
);
var SimulateScenario = proto3.makeMessageType(
  "livekit.SimulateScenario",
  () => [
    { no: 1, name: "speaker_update", kind: "scalar", T: 5, oneof: "scenario" },
    { no: 2, name: "node_failure", kind: "scalar", T: 8, oneof: "scenario" },
    { no: 3, name: "migration", kind: "scalar", T: 8, oneof: "scenario" },
    { no: 4, name: "server_leave", kind: "scalar", T: 8, oneof: "scenario" },
    { no: 5, name: "switch_candidate_protocol", kind: "enum", T: proto3.getEnumType(CandidateProtocol), oneof: "scenario" },
    { no: 6, name: "subscriber_bandwidth", kind: "scalar", T: 3, oneof: "scenario" },
    { no: 7, name: "disconnect_signal_on_resume", kind: "scalar", T: 8, oneof: "scenario" },
    { no: 8, name: "disconnect_signal_on_resume_no_messages", kind: "scalar", T: 8, oneof: "scenario" }
  ]
);
var Ping = proto3.makeMessageType(
  "livekit.Ping",
  () => [
    {
      no: 1,
      name: "timestamp",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 2,
      name: "rtt",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    }
  ]
);
var Pong = proto3.makeMessageType(
  "livekit.Pong",
  () => [
    {
      no: 1,
      name: "last_ping_timestamp",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 2,
      name: "timestamp",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    }
  ]
);
var RegionSettings = proto3.makeMessageType(
  "livekit.RegionSettings",
  () => [
    { no: 1, name: "regions", kind: "message", T: RegionInfo, repeated: true }
  ]
);
var RegionInfo = proto3.makeMessageType(
  "livekit.RegionInfo",
  () => [
    {
      no: 1,
      name: "region",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "url",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "distance",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    }
  ]
);
var SubscriptionResponse = proto3.makeMessageType(
  "livekit.SubscriptionResponse",
  () => [
    {
      no: 1,
      name: "track_sid",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 2, name: "err", kind: "enum", T: proto3.getEnumType(SubscriptionError) }
  ]
);

// gen/livekit_egress_pb.js
var EncodedFileType = proto3.makeEnum(
  "livekit.EncodedFileType",
  [
    { no: 0, name: "DEFAULT_FILETYPE" },
    { no: 1, name: "MP4" },
    { no: 2, name: "OGG" }
  ]
);
var SegmentedFileProtocol = proto3.makeEnum(
  "livekit.SegmentedFileProtocol",
  [
    { no: 0, name: "DEFAULT_SEGMENTED_FILE_PROTOCOL" },
    { no: 1, name: "HLS_PROTOCOL" }
  ]
);
var SegmentedFileSuffix = proto3.makeEnum(
  "livekit.SegmentedFileSuffix",
  [
    { no: 0, name: "INDEX" },
    { no: 1, name: "TIMESTAMP" }
  ]
);
var ImageFileSuffix = proto3.makeEnum(
  "livekit.ImageFileSuffix",
  [
    { no: 0, name: "IMAGE_SUFFIX_INDEX" },
    { no: 1, name: "IMAGE_SUFFIX_TIMESTAMP" }
  ]
);
var StreamProtocol = proto3.makeEnum(
  "livekit.StreamProtocol",
  [
    { no: 0, name: "DEFAULT_PROTOCOL" },
    { no: 1, name: "RTMP" }
  ]
);
var EncodingOptionsPreset = proto3.makeEnum(
  "livekit.EncodingOptionsPreset",
  [
    { no: 0, name: "H264_720P_30" },
    { no: 1, name: "H264_720P_60" },
    { no: 2, name: "H264_1080P_30" },
    { no: 3, name: "H264_1080P_60" },
    { no: 4, name: "PORTRAIT_H264_720P_30" },
    { no: 5, name: "PORTRAIT_H264_720P_60" },
    { no: 6, name: "PORTRAIT_H264_1080P_30" },
    { no: 7, name: "PORTRAIT_H264_1080P_60" }
  ]
);
var EgressStatus = proto3.makeEnum(
  "livekit.EgressStatus",
  [
    { no: 0, name: "EGRESS_STARTING" },
    { no: 1, name: "EGRESS_ACTIVE" },
    { no: 2, name: "EGRESS_ENDING" },
    { no: 3, name: "EGRESS_COMPLETE" },
    { no: 4, name: "EGRESS_FAILED" },
    { no: 5, name: "EGRESS_ABORTED" },
    { no: 6, name: "EGRESS_LIMIT_REACHED" }
  ]
);
var RoomCompositeEgressRequest = proto3.makeMessageType(
  "livekit.RoomCompositeEgressRequest",
  () => [
    {
      no: 1,
      name: "room_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "layout",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "audio_only",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    {
      no: 4,
      name: "video_only",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    {
      no: 5,
      name: "custom_base_url",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 6, name: "file", kind: "message", T: EncodedFileOutput, oneof: "output" },
    { no: 7, name: "stream", kind: "message", T: StreamOutput, oneof: "output" },
    { no: 10, name: "segments", kind: "message", T: SegmentedFileOutput, oneof: "output" },
    { no: 8, name: "preset", kind: "enum", T: proto3.getEnumType(EncodingOptionsPreset), oneof: "options" },
    { no: 9, name: "advanced", kind: "message", T: EncodingOptions, oneof: "options" },
    { no: 11, name: "file_outputs", kind: "message", T: EncodedFileOutput, repeated: true },
    { no: 12, name: "stream_outputs", kind: "message", T: StreamOutput, repeated: true },
    { no: 13, name: "segment_outputs", kind: "message", T: SegmentedFileOutput, repeated: true },
    { no: 14, name: "image_outputs", kind: "message", T: ImageOutput, repeated: true }
  ]
);
var WebEgressRequest = proto3.makeMessageType(
  "livekit.WebEgressRequest",
  () => [
    {
      no: 1,
      name: "url",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "audio_only",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    {
      no: 3,
      name: "video_only",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    {
      no: 12,
      name: "await_start_signal",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 4, name: "file", kind: "message", T: EncodedFileOutput, oneof: "output" },
    { no: 5, name: "stream", kind: "message", T: StreamOutput, oneof: "output" },
    { no: 6, name: "segments", kind: "message", T: SegmentedFileOutput, oneof: "output" },
    { no: 7, name: "preset", kind: "enum", T: proto3.getEnumType(EncodingOptionsPreset), oneof: "options" },
    { no: 8, name: "advanced", kind: "message", T: EncodingOptions, oneof: "options" },
    { no: 9, name: "file_outputs", kind: "message", T: EncodedFileOutput, repeated: true },
    { no: 10, name: "stream_outputs", kind: "message", T: StreamOutput, repeated: true },
    { no: 11, name: "segment_outputs", kind: "message", T: SegmentedFileOutput, repeated: true },
    { no: 13, name: "image_outputs", kind: "message", T: ImageOutput, repeated: true }
  ]
);
var ParticipantEgressRequest = proto3.makeMessageType(
  "livekit.ParticipantEgressRequest",
  () => [
    {
      no: 1,
      name: "room_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "identity",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "screen_share",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 4, name: "preset", kind: "enum", T: proto3.getEnumType(EncodingOptionsPreset), oneof: "options" },
    { no: 5, name: "advanced", kind: "message", T: EncodingOptions, oneof: "options" },
    { no: 6, name: "file_outputs", kind: "message", T: EncodedFileOutput, repeated: true },
    { no: 7, name: "stream_outputs", kind: "message", T: StreamOutput, repeated: true },
    { no: 8, name: "segment_outputs", kind: "message", T: SegmentedFileOutput, repeated: true },
    { no: 9, name: "image_outputs", kind: "message", T: ImageOutput, repeated: true }
  ]
);
var TrackCompositeEgressRequest = proto3.makeMessageType(
  "livekit.TrackCompositeEgressRequest",
  () => [
    {
      no: 1,
      name: "room_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "audio_track_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "video_track_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 4, name: "file", kind: "message", T: EncodedFileOutput, oneof: "output" },
    { no: 5, name: "stream", kind: "message", T: StreamOutput, oneof: "output" },
    { no: 8, name: "segments", kind: "message", T: SegmentedFileOutput, oneof: "output" },
    { no: 6, name: "preset", kind: "enum", T: proto3.getEnumType(EncodingOptionsPreset), oneof: "options" },
    { no: 7, name: "advanced", kind: "message", T: EncodingOptions, oneof: "options" },
    { no: 11, name: "file_outputs", kind: "message", T: EncodedFileOutput, repeated: true },
    { no: 12, name: "stream_outputs", kind: "message", T: StreamOutput, repeated: true },
    { no: 13, name: "segment_outputs", kind: "message", T: SegmentedFileOutput, repeated: true },
    { no: 14, name: "image_outputs", kind: "message", T: ImageOutput, repeated: true }
  ]
);
var TrackEgressRequest = proto3.makeMessageType(
  "livekit.TrackEgressRequest",
  () => [
    {
      no: 1,
      name: "room_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "track_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 3, name: "file", kind: "message", T: DirectFileOutput, oneof: "output" },
    { no: 4, name: "websocket_url", kind: "scalar", T: 9, oneof: "output" }
  ]
);
var EncodedFileOutput = proto3.makeMessageType(
  "livekit.EncodedFileOutput",
  () => [
    { no: 1, name: "file_type", kind: "enum", T: proto3.getEnumType(EncodedFileType) },
    {
      no: 2,
      name: "filepath",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 6,
      name: "disable_manifest",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 3, name: "s3", kind: "message", T: S3Upload, oneof: "output" },
    { no: 4, name: "gcp", kind: "message", T: GCPUpload, oneof: "output" },
    { no: 5, name: "azure", kind: "message", T: AzureBlobUpload, oneof: "output" },
    { no: 7, name: "aliOSS", kind: "message", T: AliOSSUpload, oneof: "output" }
  ]
);
var SegmentedFileOutput = proto3.makeMessageType(
  "livekit.SegmentedFileOutput",
  () => [
    { no: 1, name: "protocol", kind: "enum", T: proto3.getEnumType(SegmentedFileProtocol) },
    {
      no: 2,
      name: "filename_prefix",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "playlist_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 11,
      name: "live_playlist_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 4,
      name: "segment_duration",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    { no: 10, name: "filename_suffix", kind: "enum", T: proto3.getEnumType(SegmentedFileSuffix) },
    {
      no: 8,
      name: "disable_manifest",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 5, name: "s3", kind: "message", T: S3Upload, oneof: "output" },
    { no: 6, name: "gcp", kind: "message", T: GCPUpload, oneof: "output" },
    { no: 7, name: "azure", kind: "message", T: AzureBlobUpload, oneof: "output" },
    { no: 9, name: "aliOSS", kind: "message", T: AliOSSUpload, oneof: "output" }
  ]
);
var DirectFileOutput = proto3.makeMessageType(
  "livekit.DirectFileOutput",
  () => [
    {
      no: 1,
      name: "filepath",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 5,
      name: "disable_manifest",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 2, name: "s3", kind: "message", T: S3Upload, oneof: "output" },
    { no: 3, name: "gcp", kind: "message", T: GCPUpload, oneof: "output" },
    { no: 4, name: "azure", kind: "message", T: AzureBlobUpload, oneof: "output" },
    { no: 6, name: "aliOSS", kind: "message", T: AliOSSUpload, oneof: "output" }
  ]
);
var ImageOutput = proto3.makeMessageType(
  "livekit.ImageOutput",
  () => [
    {
      no: 1,
      name: "capture_interval",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 2,
      name: "width",
      kind: "scalar",
      T: 5
      /* ScalarType.INT32 */
    },
    {
      no: 3,
      name: "height",
      kind: "scalar",
      T: 5
      /* ScalarType.INT32 */
    },
    {
      no: 4,
      name: "filename_prefix",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 5, name: "filename_suffix", kind: "enum", T: proto3.getEnumType(ImageFileSuffix) },
    { no: 6, name: "image_codec", kind: "enum", T: proto3.getEnumType(ImageCodec) },
    {
      no: 7,
      name: "disable_manifest",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 8, name: "s3", kind: "message", T: S3Upload, oneof: "output" },
    { no: 9, name: "gcp", kind: "message", T: GCPUpload, oneof: "output" },
    { no: 10, name: "azure", kind: "message", T: AzureBlobUpload, oneof: "output" },
    { no: 11, name: "aliOSS", kind: "message", T: AliOSSUpload, oneof: "output" }
  ]
);
var S3Upload = proto3.makeMessageType(
  "livekit.S3Upload",
  () => [
    {
      no: 1,
      name: "access_key",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "secret",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "region",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 4,
      name: "endpoint",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 5,
      name: "bucket",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 6,
      name: "force_path_style",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 7, name: "metadata", kind: "map", K: 9, V: {
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    } },
    {
      no: 8,
      name: "tagging",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 9,
      name: "content_disposition",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var GCPUpload = proto3.makeMessageType(
  "livekit.GCPUpload",
  () => [
    {
      no: 1,
      name: "credentials",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "bucket",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var AzureBlobUpload = proto3.makeMessageType(
  "livekit.AzureBlobUpload",
  () => [
    {
      no: 1,
      name: "account_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "account_key",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "container_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var AliOSSUpload = proto3.makeMessageType(
  "livekit.AliOSSUpload",
  () => [
    {
      no: 1,
      name: "access_key",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "secret",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "region",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 4,
      name: "endpoint",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 5,
      name: "bucket",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var StreamOutput = proto3.makeMessageType(
  "livekit.StreamOutput",
  () => [
    { no: 1, name: "protocol", kind: "enum", T: proto3.getEnumType(StreamProtocol) },
    { no: 2, name: "urls", kind: "scalar", T: 9, repeated: true }
  ]
);
var EncodingOptions = proto3.makeMessageType(
  "livekit.EncodingOptions",
  () => [
    {
      no: 1,
      name: "width",
      kind: "scalar",
      T: 5
      /* ScalarType.INT32 */
    },
    {
      no: 2,
      name: "height",
      kind: "scalar",
      T: 5
      /* ScalarType.INT32 */
    },
    {
      no: 3,
      name: "depth",
      kind: "scalar",
      T: 5
      /* ScalarType.INT32 */
    },
    {
      no: 4,
      name: "framerate",
      kind: "scalar",
      T: 5
      /* ScalarType.INT32 */
    },
    { no: 5, name: "audio_codec", kind: "enum", T: proto3.getEnumType(AudioCodec) },
    {
      no: 6,
      name: "audio_bitrate",
      kind: "scalar",
      T: 5
      /* ScalarType.INT32 */
    },
    {
      no: 11,
      name: "audio_quality",
      kind: "scalar",
      T: 5
      /* ScalarType.INT32 */
    },
    {
      no: 7,
      name: "audio_frequency",
      kind: "scalar",
      T: 5
      /* ScalarType.INT32 */
    },
    { no: 8, name: "video_codec", kind: "enum", T: proto3.getEnumType(VideoCodec) },
    {
      no: 9,
      name: "video_bitrate",
      kind: "scalar",
      T: 5
      /* ScalarType.INT32 */
    },
    {
      no: 12,
      name: "video_quality",
      kind: "scalar",
      T: 5
      /* ScalarType.INT32 */
    },
    {
      no: 10,
      name: "key_frame_interval",
      kind: "scalar",
      T: 1
      /* ScalarType.DOUBLE */
    }
  ]
);
var UpdateLayoutRequest = proto3.makeMessageType(
  "livekit.UpdateLayoutRequest",
  () => [
    {
      no: 1,
      name: "egress_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "layout",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var UpdateStreamRequest = proto3.makeMessageType(
  "livekit.UpdateStreamRequest",
  () => [
    {
      no: 1,
      name: "egress_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 2, name: "add_output_urls", kind: "scalar", T: 9, repeated: true },
    { no: 3, name: "remove_output_urls", kind: "scalar", T: 9, repeated: true }
  ]
);
var ListEgressRequest = proto3.makeMessageType(
  "livekit.ListEgressRequest",
  () => [
    {
      no: 1,
      name: "room_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "egress_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "active",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    }
  ]
);
var ListEgressResponse = proto3.makeMessageType(
  "livekit.ListEgressResponse",
  () => [
    { no: 1, name: "items", kind: "message", T: EgressInfo, repeated: true }
  ]
);
var StopEgressRequest = proto3.makeMessageType(
  "livekit.StopEgressRequest",
  () => [
    {
      no: 1,
      name: "egress_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var EgressInfo = proto3.makeMessageType(
  "livekit.EgressInfo",
  () => [
    {
      no: 1,
      name: "egress_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "room_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 13,
      name: "room_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 3, name: "status", kind: "enum", T: proto3.getEnumType(EgressStatus) },
    {
      no: 10,
      name: "started_at",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 11,
      name: "ended_at",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 18,
      name: "updated_at",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 9,
      name: "error",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 4, name: "room_composite", kind: "message", T: RoomCompositeEgressRequest, oneof: "request" },
    { no: 14, name: "web", kind: "message", T: WebEgressRequest, oneof: "request" },
    { no: 19, name: "participant", kind: "message", T: ParticipantEgressRequest, oneof: "request" },
    { no: 5, name: "track_composite", kind: "message", T: TrackCompositeEgressRequest, oneof: "request" },
    { no: 6, name: "track", kind: "message", T: TrackEgressRequest, oneof: "request" },
    { no: 7, name: "stream", kind: "message", T: StreamInfoList, oneof: "result" },
    { no: 8, name: "file", kind: "message", T: FileInfo, oneof: "result" },
    { no: 12, name: "segments", kind: "message", T: SegmentsInfo, oneof: "result" },
    { no: 15, name: "stream_results", kind: "message", T: StreamInfo, repeated: true },
    { no: 16, name: "file_results", kind: "message", T: FileInfo, repeated: true },
    { no: 17, name: "segment_results", kind: "message", T: SegmentsInfo, repeated: true },
    { no: 20, name: "image_results", kind: "message", T: ImagesInfo, repeated: true }
  ]
);
var StreamInfoList = proto3.makeMessageType(
  "livekit.StreamInfoList",
  () => [
    { no: 1, name: "info", kind: "message", T: StreamInfo, repeated: true }
  ]
);
var StreamInfo = proto3.makeMessageType(
  "livekit.StreamInfo",
  () => [
    {
      no: 1,
      name: "url",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "started_at",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 3,
      name: "ended_at",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 4,
      name: "duration",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    { no: 5, name: "status", kind: "enum", T: proto3.getEnumType(StreamInfo_Status) },
    {
      no: 6,
      name: "error",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var StreamInfo_Status = proto3.makeEnum(
  "livekit.StreamInfo.Status",
  [
    { no: 0, name: "ACTIVE" },
    { no: 1, name: "FINISHED" },
    { no: 2, name: "FAILED" }
  ]
);
var FileInfo = proto3.makeMessageType(
  "livekit.FileInfo",
  () => [
    {
      no: 1,
      name: "filename",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "started_at",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 3,
      name: "ended_at",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 6,
      name: "duration",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 4,
      name: "size",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 5,
      name: "location",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var SegmentsInfo = proto3.makeMessageType(
  "livekit.SegmentsInfo",
  () => [
    {
      no: 1,
      name: "playlist_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 8,
      name: "live_playlist_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "duration",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 3,
      name: "size",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 4,
      name: "playlist_location",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 9,
      name: "live_playlist_location",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 5,
      name: "segment_count",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 6,
      name: "started_at",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 7,
      name: "ended_at",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    }
  ]
);
var ImagesInfo = proto3.makeMessageType(
  "livekit.ImagesInfo",
  () => [
    {
      no: 1,
      name: "image_count",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 2,
      name: "started_at",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 3,
      name: "ended_at",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    }
  ]
);
var AutoParticipantEgress = proto3.makeMessageType(
  "livekit.AutoParticipantEgress",
  () => [
    { no: 1, name: "preset", kind: "enum", T: proto3.getEnumType(EncodingOptionsPreset), oneof: "options" },
    { no: 2, name: "advanced", kind: "message", T: EncodingOptions, oneof: "options" },
    { no: 3, name: "file_outputs", kind: "message", T: EncodedFileOutput, repeated: true },
    { no: 4, name: "segment_outputs", kind: "message", T: SegmentedFileOutput, repeated: true }
  ]
);
var AutoTrackEgress = proto3.makeMessageType(
  "livekit.AutoTrackEgress",
  () => [
    {
      no: 1,
      name: "filepath",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 5,
      name: "disable_manifest",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 2, name: "s3", kind: "message", T: S3Upload, oneof: "output" },
    { no: 3, name: "gcp", kind: "message", T: GCPUpload, oneof: "output" },
    { no: 4, name: "azure", kind: "message", T: AzureBlobUpload, oneof: "output" }
  ]
);

// gen/livekit_ingress_pb.js
var IngressInput = proto3.makeEnum(
  "livekit.IngressInput",
  [
    { no: 0, name: "RTMP_INPUT" },
    { no: 1, name: "WHIP_INPUT" },
    { no: 2, name: "URL_INPUT" }
  ]
);
var IngressAudioEncodingPreset = proto3.makeEnum(
  "livekit.IngressAudioEncodingPreset",
  [
    { no: 0, name: "OPUS_STEREO_96KBPS" },
    { no: 1, name: "OPUS_MONO_64KBS" }
  ]
);
var IngressVideoEncodingPreset = proto3.makeEnum(
  "livekit.IngressVideoEncodingPreset",
  [
    { no: 0, name: "H264_720P_30FPS_3_LAYERS" },
    { no: 1, name: "H264_1080P_30FPS_3_LAYERS" },
    { no: 2, name: "H264_540P_25FPS_2_LAYERS" },
    { no: 3, name: "H264_720P_30FPS_1_LAYER" },
    { no: 4, name: "H264_1080P_30FPS_1_LAYER" },
    { no: 5, name: "H264_720P_30FPS_3_LAYERS_HIGH_MOTION" },
    { no: 6, name: "H264_1080P_30FPS_3_LAYERS_HIGH_MOTION" },
    { no: 7, name: "H264_540P_25FPS_2_LAYERS_HIGH_MOTION" },
    { no: 8, name: "H264_720P_30FPS_1_LAYER_HIGH_MOTION" },
    { no: 9, name: "H264_1080P_30FPS_1_LAYER_HIGH_MOTION" }
  ]
);
var CreateIngressRequest = proto3.makeMessageType(
  "livekit.CreateIngressRequest",
  () => [
    { no: 1, name: "input_type", kind: "enum", T: proto3.getEnumType(IngressInput) },
    {
      no: 9,
      name: "url",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "room_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 4,
      name: "participant_identity",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 5,
      name: "participant_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 10,
      name: "participant_metadata",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 8,
      name: "bypass_transcoding",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 6, name: "audio", kind: "message", T: IngressAudioOptions },
    { no: 7, name: "video", kind: "message", T: IngressVideoOptions }
  ]
);
var IngressAudioOptions = proto3.makeMessageType(
  "livekit.IngressAudioOptions",
  () => [
    {
      no: 1,
      name: "name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 2, name: "source", kind: "enum", T: proto3.getEnumType(TrackSource) },
    { no: 3, name: "preset", kind: "enum", T: proto3.getEnumType(IngressAudioEncodingPreset), oneof: "encoding_options" },
    { no: 4, name: "options", kind: "message", T: IngressAudioEncodingOptions, oneof: "encoding_options" }
  ]
);
var IngressVideoOptions = proto3.makeMessageType(
  "livekit.IngressVideoOptions",
  () => [
    {
      no: 1,
      name: "name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 2, name: "source", kind: "enum", T: proto3.getEnumType(TrackSource) },
    { no: 3, name: "preset", kind: "enum", T: proto3.getEnumType(IngressVideoEncodingPreset), oneof: "encoding_options" },
    { no: 4, name: "options", kind: "message", T: IngressVideoEncodingOptions, oneof: "encoding_options" }
  ]
);
var IngressAudioEncodingOptions = proto3.makeMessageType(
  "livekit.IngressAudioEncodingOptions",
  () => [
    { no: 1, name: "audio_codec", kind: "enum", T: proto3.getEnumType(AudioCodec) },
    {
      no: 2,
      name: "bitrate",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 3,
      name: "disable_dtx",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    {
      no: 4,
      name: "channels",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    }
  ]
);
var IngressVideoEncodingOptions = proto3.makeMessageType(
  "livekit.IngressVideoEncodingOptions",
  () => [
    { no: 1, name: "video_codec", kind: "enum", T: proto3.getEnumType(VideoCodec) },
    {
      no: 2,
      name: "frame_rate",
      kind: "scalar",
      T: 1
      /* ScalarType.DOUBLE */
    },
    { no: 3, name: "layers", kind: "message", T: VideoLayer, repeated: true }
  ]
);
var IngressInfo = proto3.makeMessageType(
  "livekit.IngressInfo",
  () => [
    {
      no: 1,
      name: "ingress_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "stream_key",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 4,
      name: "url",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 5, name: "input_type", kind: "enum", T: proto3.getEnumType(IngressInput) },
    {
      no: 13,
      name: "bypass_transcoding",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 6, name: "audio", kind: "message", T: IngressAudioOptions },
    { no: 7, name: "video", kind: "message", T: IngressVideoOptions },
    {
      no: 8,
      name: "room_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 9,
      name: "participant_identity",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 10,
      name: "participant_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 14,
      name: "participant_metadata",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 11,
      name: "reusable",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    },
    { no: 12, name: "state", kind: "message", T: IngressState }
  ]
);
var IngressState = proto3.makeMessageType(
  "livekit.IngressState",
  () => [
    { no: 1, name: "status", kind: "enum", T: proto3.getEnumType(IngressState_Status) },
    {
      no: 2,
      name: "error",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 3, name: "video", kind: "message", T: InputVideoState },
    { no: 4, name: "audio", kind: "message", T: InputAudioState },
    {
      no: 5,
      name: "room_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 7,
      name: "started_at",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 8,
      name: "ended_at",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 9,
      name: "resource_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 6, name: "tracks", kind: "message", T: TrackInfo, repeated: true }
  ]
);
var IngressState_Status = proto3.makeEnum(
  "livekit.IngressState.Status",
  [
    { no: 0, name: "ENDPOINT_INACTIVE" },
    { no: 1, name: "ENDPOINT_BUFFERING" },
    { no: 2, name: "ENDPOINT_PUBLISHING" },
    { no: 3, name: "ENDPOINT_ERROR" },
    { no: 4, name: "ENDPOINT_COMPLETE" }
  ]
);
var InputVideoState = proto3.makeMessageType(
  "livekit.InputVideoState",
  () => [
    {
      no: 1,
      name: "mime_type",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "average_bitrate",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 3,
      name: "width",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 4,
      name: "height",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 5,
      name: "framerate",
      kind: "scalar",
      T: 1
      /* ScalarType.DOUBLE */
    }
  ]
);
var InputAudioState = proto3.makeMessageType(
  "livekit.InputAudioState",
  () => [
    {
      no: 1,
      name: "mime_type",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "average_bitrate",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 3,
      name: "channels",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    },
    {
      no: 4,
      name: "sample_rate",
      kind: "scalar",
      T: 13
      /* ScalarType.UINT32 */
    }
  ]
);
var UpdateIngressRequest = proto3.makeMessageType(
  "livekit.UpdateIngressRequest",
  () => [
    {
      no: 1,
      name: "ingress_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "room_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 4,
      name: "participant_identity",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 5,
      name: "participant_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 9,
      name: "participant_metadata",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 8, name: "bypass_transcoding", kind: "scalar", T: 8, opt: true },
    { no: 6, name: "audio", kind: "message", T: IngressAudioOptions },
    { no: 7, name: "video", kind: "message", T: IngressVideoOptions }
  ]
);
var ListIngressRequest = proto3.makeMessageType(
  "livekit.ListIngressRequest",
  () => [
    {
      no: 1,
      name: "room_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "ingress_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var ListIngressResponse = proto3.makeMessageType(
  "livekit.ListIngressResponse",
  () => [
    { no: 1, name: "items", kind: "message", T: IngressInfo, repeated: true }
  ]
);
var DeleteIngressRequest = proto3.makeMessageType(
  "livekit.DeleteIngressRequest",
  () => [
    {
      no: 1,
      name: "ingress_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);

// gen/livekit_webhook_pb.js
var WebhookEvent = proto3.makeMessageType(
  "livekit.WebhookEvent",
  () => [
    {
      no: 1,
      name: "event",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 2, name: "room", kind: "message", T: Room },
    { no: 3, name: "participant", kind: "message", T: ParticipantInfo },
    { no: 9, name: "egress_info", kind: "message", T: EgressInfo },
    { no: 10, name: "ingress_info", kind: "message", T: IngressInfo },
    { no: 8, name: "track", kind: "message", T: TrackInfo },
    {
      no: 6,
      name: "id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 7,
      name: "created_at",
      kind: "scalar",
      T: 3
      /* ScalarType.INT64 */
    },
    {
      no: 11,
      name: "num_dropped",
      kind: "scalar",
      T: 5
      /* ScalarType.INT32 */
    }
  ]
);

// gen/livekit_sip_pb.js
var CreateSIPTrunkRequest = proto3.makeMessageType(
  "livekit.CreateSIPTrunkRequest",
  () => [
    { no: 1, name: "inbound_addresses", kind: "scalar", T: 9, repeated: true },
    {
      no: 2,
      name: "outbound_address",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "outbound_number",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 4, name: "inbound_numbers_regex", kind: "scalar", T: 9, repeated: true },
    { no: 9, name: "inbound_numbers", kind: "scalar", T: 9, repeated: true },
    {
      no: 5,
      name: "inbound_username",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 6,
      name: "inbound_password",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 7,
      name: "outbound_username",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 8,
      name: "outbound_password",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var SIPTrunkInfo = proto3.makeMessageType(
  "livekit.SIPTrunkInfo",
  () => [
    {
      no: 1,
      name: "sip_trunk_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 2, name: "inbound_addresses", kind: "scalar", T: 9, repeated: true },
    {
      no: 3,
      name: "outbound_address",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 4,
      name: "outbound_number",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 5, name: "inbound_numbers_regex", kind: "scalar", T: 9, repeated: true },
    { no: 10, name: "inbound_numbers", kind: "scalar", T: 9, repeated: true },
    {
      no: 6,
      name: "inbound_username",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 7,
      name: "inbound_password",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 8,
      name: "outbound_username",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 9,
      name: "outbound_password",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var ListSIPTrunkRequest = proto3.makeMessageType(
  "livekit.ListSIPTrunkRequest",
  []
);
var ListSIPTrunkResponse = proto3.makeMessageType(
  "livekit.ListSIPTrunkResponse",
  () => [
    { no: 1, name: "items", kind: "message", T: SIPTrunkInfo, repeated: true }
  ]
);
var DeleteSIPTrunkRequest = proto3.makeMessageType(
  "livekit.DeleteSIPTrunkRequest",
  () => [
    {
      no: 1,
      name: "sip_trunk_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var SIPDispatchRuleDirect = proto3.makeMessageType(
  "livekit.SIPDispatchRuleDirect",
  () => [
    {
      no: 1,
      name: "room_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "pin",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var SIPDispatchRuleIndividual = proto3.makeMessageType(
  "livekit.SIPDispatchRuleIndividual",
  () => [
    {
      no: 1,
      name: "room_prefix",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "pin",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var SIPDispatchRule = proto3.makeMessageType(
  "livekit.SIPDispatchRule",
  () => [
    { no: 1, name: "dispatch_rule_direct", kind: "message", T: SIPDispatchRuleDirect, oneof: "rule" },
    { no: 2, name: "dispatch_rule_individual", kind: "message", T: SIPDispatchRuleIndividual, oneof: "rule" }
  ]
);
var CreateSIPDispatchRuleRequest = proto3.makeMessageType(
  "livekit.CreateSIPDispatchRuleRequest",
  () => [
    { no: 1, name: "rule", kind: "message", T: SIPDispatchRule },
    { no: 2, name: "trunk_ids", kind: "scalar", T: 9, repeated: true },
    {
      no: 3,
      name: "hide_phone_number",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    }
  ]
);
var SIPDispatchRuleInfo = proto3.makeMessageType(
  "livekit.SIPDispatchRuleInfo",
  () => [
    {
      no: 1,
      name: "sip_dispatch_rule_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    { no: 2, name: "rule", kind: "message", T: SIPDispatchRule },
    { no: 3, name: "trunk_ids", kind: "scalar", T: 9, repeated: true },
    {
      no: 4,
      name: "hide_phone_number",
      kind: "scalar",
      T: 8
      /* ScalarType.BOOL */
    }
  ]
);
var ListSIPDispatchRuleRequest = proto3.makeMessageType(
  "livekit.ListSIPDispatchRuleRequest",
  []
);
var ListSIPDispatchRuleResponse = proto3.makeMessageType(
  "livekit.ListSIPDispatchRuleResponse",
  () => [
    { no: 1, name: "items", kind: "message", T: SIPDispatchRuleInfo, repeated: true }
  ]
);
var DeleteSIPDispatchRuleRequest = proto3.makeMessageType(
  "livekit.DeleteSIPDispatchRuleRequest",
  () => [
    {
      no: 1,
      name: "sip_dispatch_rule_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var CreateSIPParticipantRequest = proto3.makeMessageType(
  "livekit.CreateSIPParticipantRequest",
  () => [
    {
      no: 1,
      name: "sip_trunk_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "sip_call_to",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "room_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 4,
      name: "participant_identity",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
var SIPParticipantInfo = proto3.makeMessageType(
  "livekit.SIPParticipantInfo",
  () => [
    {
      no: 1,
      name: "participant_id",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 2,
      name: "participant_identity",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    },
    {
      no: 3,
      name: "room_name",
      kind: "scalar",
      T: 9
      /* ScalarType.STRING */
    }
  ]
);
export {
  ActiveSpeakerUpdate,
  AddTrackRequest,
  AgentInfo,
  AliOSSUpload,
  AudioCodec,
  AutoParticipantEgress,
  AutoTrackEgress,
  AvailabilityRequest,
  AvailabilityResponse,
  AzureBlobUpload,
  CandidateProtocol,
  ClientConfigSetting,
  ClientConfiguration,
  ClientInfo,
  ClientInfo_SDK,
  Codec,
  ConnectionQuality,
  ConnectionQualityInfo,
  ConnectionQualityUpdate,
  CreateIngressRequest,
  CreateSIPDispatchRuleRequest,
  CreateSIPParticipantRequest,
  CreateSIPTrunkRequest,
  DataChannelInfo,
  DataPacket,
  DataPacket_Kind,
  DeleteIngressRequest,
  DeleteSIPDispatchRuleRequest,
  DeleteSIPTrunkRequest,
  DirectFileOutput,
  DisabledCodecs,
  DisconnectReason,
  EgressInfo,
  EgressStatus,
  EncodedFileOutput,
  EncodedFileType,
  EncodingOptions,
  EncodingOptionsPreset,
  Encryption,
  Encryption_Type,
  FileInfo,
  GCPUpload,
  ICEServer,
  ImageCodec,
  ImageFileSuffix,
  ImageOutput,
  ImagesInfo,
  IngressAudioEncodingOptions,
  IngressAudioEncodingPreset,
  IngressAudioOptions,
  IngressInfo,
  IngressInput,
  IngressState,
  IngressState_Status,
  IngressVideoEncodingOptions,
  IngressVideoEncodingPreset,
  IngressVideoOptions,
  InputAudioState,
  InputVideoState,
  Job,
  JobAssignment,
  JobStatus,
  JobStatusUpdate,
  JobType,
  JoinResponse,
  LeaveRequest,
  LeaveRequest_Action,
  ListEgressRequest,
  ListEgressResponse,
  ListIngressRequest,
  ListIngressResponse,
  ListSIPDispatchRuleRequest,
  ListSIPDispatchRuleResponse,
  ListSIPTrunkRequest,
  ListSIPTrunkResponse,
  MuteTrackRequest,
  ParticipantEgressRequest,
  ParticipantInfo,
  ParticipantInfo_Kind,
  ParticipantInfo_State,
  ParticipantPermission,
  ParticipantTracks,
  ParticipantUpdate,
  Ping,
  PlayoutDelay,
  Pong,
  RTPDrift,
  RTPStats,
  ReconnectReason,
  ReconnectResponse,
  RegionInfo,
  RegionSettings,
  RegisterWorkerRequest,
  RegisterWorkerResponse,
  Room,
  RoomCompositeEgressRequest,
  RoomUpdate,
  S3Upload,
  SIPDispatchRule,
  SIPDispatchRuleDirect,
  SIPDispatchRuleIndividual,
  SIPDispatchRuleInfo,
  SIPParticipantInfo,
  SIPTrunkInfo,
  SegmentedFileOutput,
  SegmentedFileProtocol,
  SegmentedFileSuffix,
  SegmentsInfo,
  ServerInfo,
  ServerInfo_Edition,
  ServerMessage,
  SessionDescription,
  SignalRequest,
  SignalResponse,
  SignalTarget,
  SimulateScenario,
  SimulcastCodec,
  SimulcastCodecInfo,
  SpeakerInfo,
  SpeakersChanged,
  StopEgressRequest,
  StreamInfo,
  StreamInfoList,
  StreamInfo_Status,
  StreamOutput,
  StreamProtocol,
  StreamState,
  StreamStateInfo,
  StreamStateUpdate,
  SubscribedCodec,
  SubscribedQuality,
  SubscribedQualityUpdate,
  SubscriptionError,
  SubscriptionPermission,
  SubscriptionPermissionUpdate,
  SubscriptionResponse,
  SyncState,
  TimedVersion,
  TrackCompositeEgressRequest,
  TrackEgressRequest,
  TrackInfo,
  TrackPermission,
  TrackPublishedResponse,
  TrackSource,
  TrackType,
  TrackUnpublishedResponse,
  TrickleRequest,
  UpdateIngressRequest,
  UpdateLayoutRequest,
  UpdateParticipantMetadata,
  UpdateStreamRequest,
  UpdateSubscription,
  UpdateTrackSettings,
  UpdateVideoLayers,
  UpdateWorkerStatus,
  UserPacket,
  VideoCodec,
  VideoConfiguration,
  VideoLayer,
  VideoQuality,
  WebEgressRequest,
  WebhookEvent,
  WorkerMessage,
  WorkerStatus,
  version
};
