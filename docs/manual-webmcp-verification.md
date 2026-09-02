# Final real WebMCP verification

Automated real-browser verification has passed for both businesses in installed Chrome 151.0.7922.137. Run this short checklist in a visible supported browser to capture inspector or ChatGPT evidence for the video/Devpost.

## Chrome setup

1. Use Chrome 149 or later.
2. Open `chrome://flags/#enable-webmcp-testing`.
3. Enable the flag and relaunch Chrome.
4. Install Chrome's Model Context Tool Inspector extension if available, or use the browser's supported WebMCP inspection surface.
5. Open https://aliigo-webmcp-challenge.vercel.app/diagnostics.

Record the exact Chrome version from `chrome://version`, the flag state, and the date.

## Luma evidence

1. Select **Luma Wellness Studio**.
2. Verify these registered tools:
   - `search_business_knowledge`
   - `find_services`
   - `find_available_times`
   - `prepare_booking`
3. Invoke `find_services` with:

```json
{ "goal": "back tension", "maxPriceEur": 100 }
```

Expected: Therapeutic Massage is returned with `€85`, approved catalog provenance, and the 2026-08-30 review date.

4. Invoke `prepare_booking` with:

```json
{
  "serviceId": "therapeutic-massage",
  "date": "2026-09-04",
  "time": "16:30",
  "note": "Focus on upper-back tension"
}
```

Expected: the website visibly shows **Ready to review**. The agent has not confirmed the booking. Select **Confirm booking** yourself and capture the completed state.

## Northstar evidence

1. Switch to **Northstar Print & Sign**.
2. Verify the Luma-only tools disappear and these tools are registered:
   - `search_business_knowledge`
   - `find_print_options`
   - `check_artwork_requirements`
   - `prepare_quote_request`
3. Invoke `prepare_quote_request` with:

```json
{
  "productId": "event-postcards",
  "quantity": 500,
  "size": "A6",
  "stockId": "silk-350",
  "artworkSupplied": true,
  "neededBy": "2026-09-11"
}
```

Expected: the website visibly shows the 500-postcard quote draft and awaits human review. Select **Review and submit** yourself.

## ChatGPT in-app browser

Open the same live URL in ChatGPT's supported in-app browser. Use the two natural-language prompts shown in the website and confirm the same tools and visible states are used. Do not treat the simulation button as real WebMCP evidence.

## Evidence checklist

- [ ] Browser and exact version recorded.
- [ ] Testing flag or ChatGPT browser recorded.
- [ ] Luma registered-tool screenshot.
- [ ] Luma real tool invocation screenshot or video clip.
- [ ] Northstar reconciled-tool screenshot.
- [ ] Northstar real tool invocation screenshot or video clip.
- [ ] Human confirmation shown separately from agent preparation.
- [ ] No browser console errors.
