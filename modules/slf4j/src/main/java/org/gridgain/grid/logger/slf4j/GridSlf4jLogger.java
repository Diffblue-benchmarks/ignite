/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.gridgain.grid.logger.slf4j;

import org.apache.ignite.*;
import org.jetbrains.annotations.*;
import org.slf4j.*;

/**
 * SLF4J-based implementation for logging. This logger should be used
 * by loaders that have prefer slf4j-based logging.
 * <p>
 * Here is an example of configuring SLF4J logger in GridGain configuration Spring file:
 * <pre name="code" class="xml">
 *      &lt;property name="gridLogger"&gt;
 *          &lt;bean class="org.gridgain.grid.logger.slf4j.GridSlf4jLogger"/&gt;
 *      &lt;/property&gt;
 * </pre>
 * <p>
 * It's recommended to use GridGain's logger injection instead of using/instantiating
 * logger in your task/job code. See {@link org.apache.ignite.resources.IgniteLoggerResource} annotation about logger
 * injection.
 */
public class GridSlf4jLogger implements IgniteLogger {
    /** */
    private static final long serialVersionUID = 0L;

    /** SLF4J implementation proxy. */
    private final Logger impl;

    /**
     * Creates new logger.
     */
    public GridSlf4jLogger() {
        impl = LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
    }

    /**
     * Creates new logger with given implementation.
     *
     * @param impl SLF4J implementation to use.
     */
    public GridSlf4jLogger(Logger impl) {
        assert impl != null;

        this.impl = impl;
    }

    /** {@inheritDoc} */
    @Override public GridSlf4jLogger getLogger(Object ctgr) {
        Logger impl = ctgr == null ? LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME) :
            ctgr instanceof Class ? LoggerFactory.getLogger(((Class<?>)ctgr).getName()) :
                LoggerFactory.getLogger(ctgr.toString());

        return new GridSlf4jLogger(impl);
    }

    /** {@inheritDoc} */
    @Override public void trace(String msg) {
        if (!impl.isTraceEnabled())
            warning("Logging at TRACE level without checking if TRACE level is enabled: " + msg);

        impl.trace(msg);
    }

    /** {@inheritDoc} */
    @Override public void debug(String msg) {
        if (!impl.isDebugEnabled())
            warning("Logging at DEBUG level without checking if DEBUG level is enabled: " + msg);

        impl.debug(msg);
    }

    /** {@inheritDoc} */
    @Override public void info(String msg) {
        if (!impl.isInfoEnabled())
            warning("Logging at INFO level without checking if INFO level is enabled: " + msg);

        impl.info(msg);
    }

    /** {@inheritDoc} */
    @Override public void warning(String msg) {
        impl.warn(msg);
    }

    /** {@inheritDoc} */
    @Override public void warning(String msg, @Nullable Throwable e) {
        impl.warn(msg, e);
    }

    /** {@inheritDoc} */
    @Override public void error(String msg) {
        impl.error(msg);
    }

    /** {@inheritDoc} */
    @Override public void error(String msg, @Nullable Throwable e) {
        impl.error(msg, e);
    }

    /** {@inheritDoc} */
    @Override public boolean isTraceEnabled() {
        return impl.isTraceEnabled();
    }

    /** {@inheritDoc} */
    @Override public boolean isInfoEnabled() {
        return impl.isInfoEnabled();
    }

    /** {@inheritDoc} */
    @Override public boolean isDebugEnabled() {
        return impl.isDebugEnabled();
    }

    /** {@inheritDoc} */
    @Override public boolean isQuiet() {
        return !isInfoEnabled() && !isDebugEnabled();
    }

    /** {@inheritDoc} */
    @Nullable @Override public String fileName() {
        return null;
    }
}
