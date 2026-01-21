# API Cost Optimization

## Overview

The system has been optimized to minimize OpenAI API costs while maintaining quality.

## Cost-Saving Strategies

### 1. Model Selection: GPT-3.5-Turbo

**Switched from GPT-4o to GPT-3.5-Turbo:**
- GPT-4o: ~$5.00 per 1M input tokens, $15.00 per 1M output tokens
- GPT-3.5-Turbo: ~$0.50 per 1M input tokens, $1.50 per 1M output tokens
- **~10x cost reduction** for most operations

### 2. Batch Processing

**Parallel Requests with Concurrency Control:**
```typescript
const BATCH_SIZE = 5; // Process 5 rooms simultaneously

// Instead of sequential:
for (room of rooms) {
  await generateVariants(room); // Slow, 49 sequential calls
}

// We use batched parallel:
for (batch of chunks(rooms, 5)) {
  await Promise.all(batch.map(generateVariants)); // 10x faster
}
```

**Benefits:**
- Reduces total time from ~5 minutes to ~1 minute
- No increase in cost (same number of requests)
- Respects rate limits with delays between batches

### 3. Request Optimization

**Brief Parsing:**
- Single API call per brief
- Structured JSON output
- Low temperature (0.1) for consistency

**Variant Generation:**
- 3-4 variants per room (not exhaustive)
- Fallback to geometric generation if AI fails
- Temperature 0.3 for creative but consistent results

## Cost Estimates

### Current Brief (49 rooms, 184 instances)

**Brief Parsing (1 call):**
- Input: ~1,500 tokens (brief content + prompt)
- Output: ~2,000 tokens (JSON with 49 rooms)
- Cost: ~$0.004 per parse

**Variant Generation (49 calls in 10 batches):**
- Input per room: ~400 tokens (prompt + constraints)
- Output per room: ~300 tokens (3-4 variants)
- Total input: 49 × 400 = 19,600 tokens
- Total output: 49 × 300 = 14,700 tokens
- Cost: ~$0.032 per full generation

**Total Cost per Complete Run:**
- Parse + Generate: ~$0.036 (less than 4 cents!)

### Comparison with GPT-4o

If using GPT-4o:
- Parse: ~$0.035
- Generate: ~$0.320
- Total: ~$0.355 per run
- **~10x more expensive**

## Performance Metrics

### Sequential Processing (Old)
```
49 rooms × (API call + 300ms delay) = ~4.5 minutes
```

### Batch Processing (New)
```
10 batches × (5 parallel calls + 1s delay) = ~1 minute
5x faster!
```

## Best Practices

### When to Use AI
✅ **Use AI for:**
- Brief parsing (one-time, structured extraction)
- Variant generation (creative, context-aware)
- Room proportion recommendations

❌ **Don't use AI for:**
- Grid snapping (simple math)
- Area calculations (formulaic)
- Constraint validation (rule-based)
- Geometric fallbacks (deterministic)

### Caching Strategy (Future)

For repeated runs on same brief:
1. Cache parsed brief JSON
2. Only regenerate variants if room constraints change
3. Store common room type templates
4. Use fallback variants for small utility rooms

## Rate Limiting

**OpenAI Rate Limits (GPT-3.5-Turbo):**
- Tier 1: 3,500 requests/day, 200 requests/minute
- Our usage: ~50 requests per run, well within limits

**Batch Configuration:**
```typescript
const BATCH_SIZE = 5;        // Parallel requests
const BATCH_DELAY = 1000;    // 1s between batches
```

These settings ensure we stay well below rate limits even with large briefs.

## Cost Tracking

**To monitor costs:**
1. Check OpenAI dashboard: https://platform.openai.com/usage
2. View by model to see GPT-3.5-Turbo usage
3. Track tokens per request in logs

**Average Token Usage:**
- Brief parsing: 3,500 tokens total
- Variant generation: 700 tokens per room
- 49 rooms = ~34,300 tokens total
- Cost: ~$0.036 per full run

## Future Optimizations

### Phase 1+
- Cache variant templates for common room types
- Reuse variants across multiple instances
- Skip AI for very small rooms (< 5m²)

### Phase 2+
- Group similar rooms in single prompt
- Use embeddings for room type classification
- Implement local fallback models for common cases

---

**Current Status:**
- ✅ Using GPT-3.5-Turbo (~10x cheaper than GPT-4o)
- ✅ Batch processing (5 parallel requests)
- ✅ Smart fallbacks (no AI for failures)
- ✅ ~$0.04 per complete brief processing

**Cost per 100 briefs:** ~$4.00 (vs ~$40 with GPT-4o)
