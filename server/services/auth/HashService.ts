import crypto from "node:crypto"

export class HashService {
    static hash(data_to_hash: string) {
        const hash = crypto.createHash("sha256")

        return hash.update(data_to_hash).digest("hex")
    }
    static check(hashedVal: string, checkVal: string) {
        const hashedCheckVal = HashService.hash(checkVal)
        return hashedCheckVal == hashedVal
    }
}
