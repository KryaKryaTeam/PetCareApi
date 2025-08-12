import crypto from "node:crypto"
import { globalLogger } from "../../utils/logger"

export class HashService {
    static hash(data_to_hash: string) {
        globalLogger.logger().setService("hash_service")
        const hash = crypto.createHash("sha256")
        globalLogger.logger().info("Hash is completed")
        return hash.update(data_to_hash).digest("hex")
    }
    static check(hashedVal: string, checkVal: string) {
        globalLogger.logger().setService("hash_service")
        const hashedCheckVal = HashService.hash(checkVal)
        globalLogger.logger().info("Hash check is completed")
        return hashedCheckVal == hashedVal
    }
}
