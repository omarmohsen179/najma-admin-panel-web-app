export function encodeInvoiceToQR(sellerName, taxId, time, invoiceTotal, tax) {
  console.log([
    { type: 1, value: sellerName },
    { type: 2, value: taxId },
    { type: 3, value: time },
    { type: 4, value: invoiceTotal },
    { type: 5, value: tax },
  ]);
  function containsArabic(text) {
    // This regular expression matches any character in the Arabic Unicode range
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text);
  }

  // Example structure, assuming encodeTLV is available and works similarly to your Python version
  //encodeURIComponent(sellerName)
  const invoiceData = [
    {
      type: 1,
      value: containsArabic(sellerName)
        ? encodeURIComponent(sellerName)
        : sellerName,
    },
    { type: 2, value: taxId },
    { type: 3, value: time },
    { type: 4, value: invoiceTotal },
    { type: 5, value: tax },
  ];

  // Encode the data to TLV format
  const tlvEncoded = encodeTLV(invoiceData);

  // Convert TLV binary data to a string for base64 encoding
  // This step may vary depending on how your TLV data is structured
  const stringToEncode = new TextDecoder().decode(tlvEncoded);

  // Encode to base64
  const base64Encoded = window.btoa(stringToEncode);
  console.log(base64Encoded);
  return base64Encoded;
}
function encodeTLV(data) {
  let buffer = [];

  data.forEach((item) => {
    // Assuming `type` is a number that fits in one byte and `value` is a string
    const type = item.type;
    const value = item.value;
    const valueBytes = new TextEncoder().encode(value);
    const length = valueBytes.length;

    // Push type and length into the buffer. Assuming length also fits in one byte for simplicity.
    buffer.push(type);
    buffer.push(length);

    // Push each byte of value into the buffer
    buffer = buffer.concat(Array.from(valueBytes));
  });

  // Convert buffer array into a Uint8Array
  return new Uint8Array(buffer);
}
